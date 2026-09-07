<?php
/* ═══════════════════════════════════════════════════════════════════
   myevents.ge — SMS proxy (smsoffice.ge)

   რას აკეთებს: ბრაუზერიდან მოსულ მოთხოვნას გადასცემს smsoffice.ge-ს.
   API key მხოლოდ ამ ფაილშია — ბრაუზერში არასდროს ჩანს.

   დაყენება:
     1. ჩასვი შენი API key ქვემოთ ($API_KEY).
     2. ატვირთე ეს ფაილი myevents.ge-ის public_html-ში.
     3. აპში: 👤 ანგარიში → 📲 SMS პარამეტრები → Proxy = /sms-proxy.php
   ═══════════════════════════════════════════════════════════════════ */

$API_KEY        = 'ჩასვი_შენი_SMSOFFICE_API_KEY';
$DEFAULT_SENDER = 'myevents';
$ALLOWED_ORIGIN = 'myevents.ge';   // '' = ყველა წყარო (მხოლოდ ტესტისთვის)
$ENABLE_LOG     = false;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$host    = $_SERVER['HTTP_HOST']    ?? '';
$isAllowed = $ALLOWED_ORIGIN === ''
  || stripos($origin,  $ALLOWED_ORIGIN) !== false
  || stripos($referer, $ALLOWED_ORIGIN) !== false
  || stripos($host,    $ALLOWED_ORIGIN) !== false;
if (!$isAllowed) {
  http_response_code(403);
  echo json_encode(['Success' => false, 'Message' => 'Origin not allowed']);
  exit;
}

function logLine($m) {
  global $ENABLE_LOG;
  if (!$ENABLE_LOG) return;
  @file_put_contents(__DIR__ . '/sms-proxy.log', '[' . date('Y-m-d H:i:s') . '] ' . $m . "\n", FILE_APPEND);
}

function httpRequest($url, $method = 'GET', $body = null, $to = 15) {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, $to);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    if ($method === 'POST') {
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
      curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    }
    $r = curl_exec($ch); $e = curl_error($ch); curl_close($ch);
    return $r === false ? ['ok' => false, 'error' => $e, 'body' => null]
                        : ['ok' => true, 'error' => null, 'body' => $r];
  }
  $ctx = stream_context_create(['http' => [
    'method' => $method, 'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
    'content' => $body ?? '', 'timeout' => $to, 'ignore_errors' => true]]);
  $r = @file_get_contents($url, false, $ctx);
  return $r === false ? ['ok' => false, 'error' => 'failed', 'body' => null]
                      : ['ok' => true, 'error' => null, 'body' => $r];
}

function normalizePhone($raw) {
  $d = preg_replace('/\D+/', '', $raw);
  if ($d === '') return '';
  if (strlen($d) === 9 && $d[0] === '5') $d = '995' . $d;
  else if (strlen($d) > 11 && substr($d, 0, 2) === '00') $d = substr($d, 2);
  return $d;
}

$action = $_REQUEST['action'] ?? 'send';

if ($action === 'balance') {
  $r = httpRequest('https://smsoffice.ge/api/getBalance?key=' . urlencode($API_KEY));
  if (!$r['ok']) { http_response_code(502); echo json_encode(['Success' => false, 'Message' => 'Upstream error']); exit; }
  echo json_encode(['Success' => true, 'Balance' => trim($r['body'])]);
  logLine('BALANCE → ' . trim($r['body']));
  exit;
}

$to     = trim($_REQUEST['to'] ?? '');
$text   = trim($_REQUEST['text'] ?? '');
$sender = trim($_REQUEST['sender'] ?? '');
if ($sender === '') $sender = $DEFAULT_SENDER;

if ($to === '' || $text === '') {
  http_response_code(400);
  echo json_encode(['Success' => false, 'Message' => 'Missing to/text']);
  exit;
}

$phone = normalizePhone($to);
if (strlen($phone) < 11) {
  http_response_code(400);
  echo json_encode(['Success' => false, 'Message' => "არასწორი ნომერი: $to"], JSON_UNESCAPED_UNICODE);
  exit;
}

$post = http_build_query(['key' => $API_KEY, 'destination' => $phone, 'sender' => $sender, 'content' => $text]);
$r = httpRequest('https://smsoffice.ge/api/v2/send/', 'POST', $post);
if (!$r['ok']) {
  http_response_code(502);
  echo json_encode(['Success' => false, 'Message' => 'Upstream error', 'Error' => $r['error']]);
  logLine("SEND to=$phone FAIL");
  exit;
}

$p = json_decode($r['body'], true);
if (is_array($p) && array_key_exists('Success', $p)) {
  logLine("SEND to=$phone " . json_encode($p, JSON_UNESCAPED_UNICODE));
  echo json_encode($p, JSON_UNESCAPED_UNICODE);
  exit;
}

$code = trim($r['body']);
$names = [
  '0' => '✅ მესიჯი მიღებულია', '10' => '❌ არაქართული ნომერი', '20' => '💰 ბალანსი არასაკმარისია',
  '40' => '⚠️ ტექსტი 160+ სიმბოლო', '60' => '❌ content ცარიელია', '70' => '❌ ნომრები აკლია',
  '75' => '🛑 ყველა STOP-შია', '76' => '❌ ფორმატი არასწორი', '77' => '🛑 STOP/არასწორი',
  '80' => '🔑 API key არასწორია', '110' => '❌ sender უცნობი', '120' => '⚠️ API უფლება გააქტიურე',
  '150' => '❌ sender ვერ მოიძებნა', '500' => '❌ key აკლია', '600' => '❌ destination აკლია',
  '700' => '❌ sender აკლია', '800' => '❌ content აკლია', '-100' => '⏳ შეფერხება'
];
$out = ['Success' => $code === '0', 'Message' => $names[$code] ?? ('უცნობი კოდი: ' . $code),
        'ErrorCode' => (int)$code, 'Raw' => $r['body']];
logLine("SEND to=$phone code=$code");
echo json_encode($out, JSON_UNESCAPED_UNICODE);
