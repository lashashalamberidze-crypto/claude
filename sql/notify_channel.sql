-- შეტყობინების არხი (Telegram / SMS) — ერთიან ლოგში (sms_log)
-- გაუშვი Supabase → SQL Editor-ში ერთხელ.
alter table public.sms_log
  add column if not exists channel text default 'sms';

create index if not exists sms_log_channel_idx
  on public.sms_log (user_id, channel, date);
