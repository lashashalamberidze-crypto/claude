-- 🔁 ყოველთვიური (ფიქსირებული) ხარჯები — იჯარა, ხელფასი, აბონემენტები…
-- გაუშვი Supabase → SQL Editor-ში ერთხელ.
create table if not exists public.recurring (
  id text primary key,
  name text,
  amount numeric,
  category text,
  code text,          -- მიმართულება (ცარიელი = ზოგადი)
  vat boolean,
  active boolean default true,
  created_at timestamptz default now()
);
alter table public.recurring enable row level security;
create policy "auth read recurring"   on public.recurring for select to authenticated using (true);
create policy "auth insert recurring" on public.recurring for insert to authenticated with check (true);
create policy "auth update recurring" on public.recurring for update to authenticated using (true);
create policy "auth delete recurring" on public.recurring for delete to authenticated using (true);

-- ხარჯის ჩანაწერს ვუკავშირებთ ყოველთვიურ შაბლონს (რომელ თვეზე გადაიხადა)
alter table public.expenses add column if not exists recurring_id text;
