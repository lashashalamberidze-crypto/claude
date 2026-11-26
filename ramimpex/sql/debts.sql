-- 💳 ვალების დაბრუნებები — ვისია ვალი, რამდენი დაბრუნდა
-- ვალი თავად იწერება შესყიდვა/ხარჯის "💰 ვალია" მონიშვნით (docs-ში ინახება, ცხრილი არ სჭირდება).
-- ეს ცხრილი მხოლოდ დაბრუნებებს ინახავს. გაუშვი Supabase → SQL Editor-ში ერთხელ.
create table if not exists public.debt_payments (
  id text primary key,
  creditor text,        -- კრედიტორი (მაგ. InterAgro)
  amount numeric,       -- თანხა ₾
  date text,            -- თარიღი (YYYY-MM-DD)
  note text,
  kind text default 'repay',  -- 'loan' = ვალის/სესხის მიღება, 'repay' = დაბრუნება
  created_at timestamptz default now()
);
-- თუ ცხრილი უკვე გქონდა, დაამატე kind სვეტი:
alter table public.debt_payments add column if not exists kind text default 'repay';
alter table public.debt_payments enable row level security;
create policy "auth read debt_payments"   on public.debt_payments for select to authenticated using (true);
create policy "auth insert debt_payments" on public.debt_payments for insert to authenticated with check (true);
create policy "auth update debt_payments" on public.debt_payments for update to authenticated using (true);
create policy "auth delete debt_payments" on public.debt_payments for delete to authenticated using (true);
