-- ============================================================================
--  RAM IMPEX — დისტრიბუცია + დისტრიბუტორების საჯარო ცნობარი
--  გაუშვი Supabase Dashboard → SQL Editor-ში ერთხელ.
--  (მოიცავს distributors ცხრილსაც — თუ უკვე გაქვს, ALTER-ები დაამატებს ახალ სვეტებს.)
-- ============================================================================

-- ---------- 1) დისტრიბუტორები (განაცხადი + საჯარო ცნობარი) ----------
create table if not exists public.distributors (
  id            text primary key,
  created_at    timestamptz default now(),
  name          text,   -- სახელი გვარი
  company_type  text,   -- ფიზიკური / ინდ.მეწარმე / შპს
  company       text,
  idc           text,
  region        text,
  municipality  text,
  address       text,
  monthly       text,
  experience    text,
  phone         text,
  contact2      text,
  note          text
);
-- ახალი სვეტები (საჯარო ცნობარისთვის — რუკა/მაღაზია)
alter table public.distributors add column if not exists approved  boolean default false;  -- დამტკიცებული (info-ზე ჩანს)
alter table public.distributors add column if not exists shop_name text;   -- მაღაზიის საჯარო სახელი
alter table public.distributors add column if not exists lat       numeric; -- რუკის კოორდინატი (არჩ.)
alter table public.distributors add column if not exists lng       numeric;
alter table public.distributors add column if not exists price     numeric; -- შეთანხმებული ფასი ₾/კგ (არჩ.)

create index if not exists distributors_approved_idx on public.distributors (approved);

alter table public.distributors enable row level security;
-- საჯარო ფორმა წერს:
drop policy if exists "distributors insert public" on public.distributors;
create policy "distributors insert public" on public.distributors
  for insert to anon, authenticated with check (true);
-- ადმინი ხედავს ყველას:
drop policy if exists "distributors read authed" on public.distributors;
create policy "distributors read authed" on public.distributors
  for select to authenticated using (true);
-- საჯაროდ (ცნობარი/რუკა) ჩანს მხოლოდ დამტკიცებული:
drop policy if exists "distributors read public approved" on public.distributors;
create policy "distributors read public approved" on public.distributors
  for select to anon using (approved = true);
-- ადმინი არედაქტირებს/შლის:
drop policy if exists "distributors update authed" on public.distributors;
create policy "distributors update authed" on public.distributors
  for update to authenticated using (true) with check (true);
drop policy if exists "distributors delete authed" on public.distributors;
create policy "distributors delete authed" on public.distributors
  for delete to authenticated using (true);

-- ---------- 2) დისტრიბუტორზე გატანა (კონსიგნაცია) ----------
create table if not exists public.dist_pickups (
  id               text primary key,
  created_at       timestamptz default now(),
  distributor_id   text,     -- distributors.id
  distributor_name text,     -- სნეპშოტი
  region           text,
  code             text,     -- პროდუქტის კოდი (მაგ. ANT)
  product          text,
  qty              numeric,  -- გატანილი რაოდენობა
  price            numeric,  -- შეთანხმებული ფასი ₾ (არჩ.)
  date             date,
  note             text
);
create index if not exists dist_pickups_dist_idx on public.dist_pickups (distributor_id);
alter table public.dist_pickups enable row level security;
drop policy if exists "dist_pickups all authed" on public.dist_pickups;
create policy "dist_pickups all authed" on public.dist_pickups
  for all to authenticated using (true) with check (true);

-- ---------- 3) დისტრიბუტორის რეპორტ-გაყიდვები ----------
create table if not exists public.dist_sales (
  id               text primary key,
  created_at       timestamptz default now(),
  distributor_id   text,     -- distributors.id
  distributor_name text,
  qty              numeric,  -- გაყიდული რაოდენობა
  buyer            text,     -- ვის მიჰყიდა (მაღაზია/კლიენტი)
  price            numeric,  -- ₾/კგ
  amount           numeric,  -- ჯამი ₾ (qty*price)
  date             date,
  note             text
);
create index if not exists dist_sales_dist_idx on public.dist_sales (distributor_id);
alter table public.dist_sales enable row level security;
drop policy if exists "dist_sales all authed" on public.dist_sales;
create policy "dist_sales all authed" on public.dist_sales
  for all to authenticated using (true) with check (true);

-- ============================================================================
--  შემოწმება:
--   select name, region, approved from public.distributors order by created_at desc;
--   select distributor_name, qty, date from public.dist_pickups order by date desc;
--   select distributor_name, buyer, qty, amount from public.dist_sales order by date desc;
-- ============================================================================
