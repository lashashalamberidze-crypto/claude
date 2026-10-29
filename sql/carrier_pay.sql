-- ============================================================================
--  AgroInTechSol — გამომტანის დღიური ფიქსირებული ხელფასი
--  გაუშვი Supabase → SQL Editor-ში ერთხელ.
--
--  ლოგიკა: გამომტანს აქვს გლობალური ფიქსირებული დღიური თანხა. დასწრების
--  „მოსვლის" QR-ის სკანისას ავტომატურად ეწერება იმ დღის თანხა. თუ ვინმემ
--  ნახევარი დღე იმუშავა — თანხა ხელით კორექტირდება იმ კონკრეტულ დღეზე.
--  (user_id, carrier_uid, date) უნიკალურია → ხელახალი სკანი არ ადუბლებს.
-- ============================================================================

create table if not exists public.krepa_carrier_pay (
  user_id     uuid    not null,
  carrier_uid text    not null,
  date        text    not null,
  amount      numeric not null default 0,
  updated_at  timestamptz default now(),
  primary key (user_id, carrier_uid, date)
);

alter table public.krepa_carrier_pay enable row level security;
drop policy if exists carrier_pay_all on public.krepa_carrier_pay;
create policy carrier_pay_all on public.krepa_carrier_pay
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- გლობალური დღიური თანხა ინახება user_settings-ში: skey='carrier_daily'.
-- შემოწმება: select * from krepa_carrier_pay order by date desc limit 10;
