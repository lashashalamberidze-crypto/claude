-- ═══════════════════════════════════════════════════════════════════════
-- ამინდის დღიური SMS — cron setup
-- გაუშვი Supabase → SQL Editor-ში (ერთხელ). შეცვალე YOUR_CRON_SECRET.
-- ═══════════════════════════════════════════════════════════════════════

-- 1) sent_log სვეტი (cross-device rate-limit) — თუ არ არსებობს
alter table public.wsms_config
  add column if not exists sent_log jsonb not null default '{}'::jsonb;

-- 2) გაფართოებები cron-ისა და http-ისთვის
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 3) დღიური განრიგი — ყოველ დილით 05:00 UTC = 09:00 თბილისში
--    (თუ იგივე სახელით უკვე არსებობს, ჯერ წავშალოთ)
select cron.unschedule('weather-daily-sms')
where exists (select 1 from cron.job where jobname = 'weather-daily-sms');

select cron.schedule(
  'weather-daily-sms',
  '0 5 * * *',
  $$
  select net.http_post(
    url     := 'https://rycyvlugqqyzrazssgop.supabase.co/functions/v1/weather-cron',
    headers := jsonb_build_object(
                 'Content-Type', 'application/json',
                 'x-cron-secret', 'YOUR_CRON_SECRET'
               ),
    body    := '{}'::jsonb
  );
  $$
);

-- ── ხელით ტესტისთვის (დაუყოვნებლივ გაშვება): ──
-- select net.http_post(
--   url     := 'https://rycyvlugqqyzrazssgop.supabase.co/functions/v1/weather-cron',
--   headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','YOUR_CRON_SECRET'),
--   body    := '{}'::jsonb
-- );

-- ── განრიგის ნახვა / წაშლა: ──
-- select * from cron.job;
-- select cron.unschedule('weather-daily-sms');
