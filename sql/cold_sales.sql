-- ============================================================================
--  AgroInTechSol — გაყიდვები/ვალები (რეალიზაცია) — პირდაპირი ან მაცივრიდან
--  გაუშვი Supabase → SQL Editor-ში ერთხელ.
--
--  source='direct' → პირდაპირი გაყიდვა (მაცივარი არ ჭირდება)
--  source='cold'   → მაცივრის ოთახიდან (room_no), გაყიდვისას cold_stock მცირდება
--  ვალი (მოსაცემი) = amount − paid_amount
-- ============================================================================

create table if not exists public.cold_sales (
  id          text primary key,
  user_id     uuid not null,
  date        text,
  buyer       text,
  source      text default 'direct',   -- 'direct' | 'cold'
  room_no     text,
  product     text,
  boxes       numeric default 0,
  kg          numeric default 0,
  price       numeric default 0,       -- ₾/კგ
  amount      numeric default 0,       -- სულ ₾
  paid_amount numeric default 0,       -- გადახდილი ₾
  note        text,
  created_at  timestamptz default now()
);
alter table public.cold_sales enable row level security;
drop policy if exists cold_sales_all on public.cold_sales;
create policy cold_sales_all on public.cold_sales
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create index if not exists cold_sales_user on public.cold_sales (user_id, date);
