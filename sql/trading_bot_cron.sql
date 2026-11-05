-- ═══════════════════════════════════════════════════════════════════════
-- სავაჭრო ბოტი — საიმედო განრიგი Supabase-იდან
--
-- GitHub-ის საკუთარი schedule ხშირად აგვიანებს ან საერთოდ ტოვებს გაშვებას.
-- Supabase-ის pg_cron ზუსტ დროზე ეშვება და GitHub-ს ეუბნება "გაუშვი ბოტი"
-- (workflow_dispatch). GitHub-ის schedule სარეზერვოდ რჩება — ორჯერ გაშვება
-- უსაფრთხოა, ბოტი ერთსა და იმავეს ორჯერ არ ყიდულობს.
--
-- გაუშვი Supabase → SQL Editor-ში (ერთხელ). ჯერ შეცვალე YOUR_GITHUB_TOKEN
-- (ნაბიჯი 2) — token ინახება Supabase Vault-ში დაშიფრულად, არა ამ ფაილში.
-- ═══════════════════════════════════════════════════════════════════════

-- 1) გაფართოებები cron-ისა და http-ისთვის
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2) GitHub token Vault-ში (თუ უკვე არსებობს, ჯერ ძველი წავშალოთ)
delete from vault.secrets where name = 'github_trading_bot_token';
select vault.create_secret('YOUR_GITHUB_TOKEN', 'github_trading_bot_token');

-- 3) ფუნქცია, რომელიც GitHub-ზე ბოტს უშვებს
create or replace function public.run_trading_bot()
returns bigint
language sql
security definer
set search_path = public
as $$
  select net.http_post(
    url     := 'https://api.github.com/repos/lashashalamberidze-crypto/claude/actions/workflows/trading-bot.yml/dispatches',
    headers := jsonb_build_object(
                 'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets
                                                where name = 'github_trading_bot_token'),
                 'Accept', 'application/vnd.github+json',
                 'User-Agent', 'supabase-trading-bot-cron',
                 'Content-Type', 'application/json'
               ),
    body    := '{"ref": "claude/gadakhedhe-o3b1ha"}'::jsonb
  );
$$;
revoke all on function public.run_trading_bot() from public, anon, authenticated;

-- 4) განრიგი: 13:17 UTC (ნიუ-იორკში გახსნამდე) და 17:47 UTC (ბირჟა ღიაა) — ყოველდღე
select cron.unschedule(jobname) from cron.job
where jobname in ('trading-bot-morning', 'trading-bot-midday');

select cron.schedule('trading-bot-morning', '17 13 * * *', 'select public.run_trading_bot();');
select cron.schedule('trading-bot-midday',  '47 17 * * *', 'select public.run_trading_bot();');

-- ── ხელით ტესტი (დაუყოვნებლივ გაშვება) — შემდეგ GitHub → Actions-ში უნდა გამოჩნდეს ახალი run: ──
-- select public.run_trading_bot();
--
-- ── პასუხის შემოწმება (201/204 = წარმატება, 401 = token არასწორია, 404 = token-ს წვდომა არ აქვს): ──
-- select id, status_code, content from net._http_response order by id desc limit 5;
--
-- ── განრიგის ნახვა / წაშლა: ──
-- select * from cron.job;
-- select cron.unschedule('trading-bot-morning'); select cron.unschedule('trading-bot-midday');
