// Supabase Edge Function: telegram-notify
// Hides the Telegram bot token. The admin panel calls this with { text }
// and it forwards the message to the configured Telegram chat.
//
// Deploy:
//   supabase functions deploy telegram-notify
// Set secrets (once):
//   supabase secrets set TELEGRAM_BOT_TOKEN=123456:ABC... TELEGRAM_CHAT_ID=123456789
//
// The bot token never reaches the browser — only this function reads it.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    const { text } = await req.json().catch(() => ({}));
    if (!text || typeof text !== "string") return json({ error: "missing text" }, 400);

    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chat = Deno.env.get("TELEGRAM_CHAT_ID");
    if (!token || !chat) return json({ error: "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set" }, 500);

    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chat,
        text: text.slice(0, 4000),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.ok === false) return json({ error: "telegram", detail: data }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
