-- 🛒 შესყიდვები (purchases) — რეალური თვითღირებულება SKU-ზე
-- გაუშვი Supabase → SQL Editor-ში ერთხელ.
create table if not exists public.purchases (
  id text primary key,
  code text,
  name text,
  dir text,
  qty numeric,
  paid numeric,
  date date,
  note text,
  docs jsonb,
  created_at timestamptz default now()
);
-- თუ ცხრილი უკვე შექმნილია, ეს ერთი ხაზი დაამატებს docs სვეტს:
alter table public.purchases add column if not exists docs jsonb;
-- დღგ-ის ჩათვლის ნიშანი (true = გადახდილი დღგ-ით, ჩაითვლება/დაბრუნდება):
alter table public.purchases add column if not exists vat boolean;
alter table public.purchases enable row level security;
create policy "auth read purchases"   on public.purchases for select to authenticated using (true);
create policy "auth insert purchases" on public.purchases for insert to authenticated with check (true);
create policy "auth update purchases" on public.purchases for update to authenticated using (true);
create policy "auth delete purchases" on public.purchases for delete to authenticated using (true);
