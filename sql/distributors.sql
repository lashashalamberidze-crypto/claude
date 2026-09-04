-- ============================================================================
--  RAM IMPEX — დისტრიბუტორების განაცხადები (distributors)
--  გაუშვი Supabase Dashboard → SQL Editor-ში ერთხელ.
--  საჯარო ფორმა anon-ით წერს; ადმინი (ავტორიზებული) კითხულობს.
-- ============================================================================

create table if not exists public.distributors (
  id            text primary key,
  created_at    timestamptz default now(),
  name          text,   -- სახელი გვარი
  company_type  text,   -- ფიზიკური / ინდ.მეწარმე / შპს
  company       text,   -- კომპანიის დასახელება
  idc           text,   -- ს/კ (არჩ.)
  region        text,   -- რეგიონი
  municipality  text,   -- მუნიციპალიტეტი
  address       text,   -- მაღაზიის მისამართი/მდებარეობა
  monthly       text,   -- სავარაუდო თვიური შესყიდვა
  experience    text,   -- გაყიდვების გამოცდილება
  phone         text,   -- ტელეფონი
  contact2      text,   -- სხვა კონტაქტი (WhatsApp/email)
  note          text
);

create index if not exists distributors_created_idx on public.distributors (created_at desc);

alter table public.distributors enable row level security;

-- საჯარო ფორმა: anon-საც და авторизებულსაც შეუძლია ჩაწერა
drop policy if exists "distributors insert public" on public.distributors;
create policy "distributors insert public" on public.distributors
  for insert to anon, authenticated with check (true);

-- წაკითხვა მხოლოდ ავტორიზებულ ადმინს
drop policy if exists "distributors read authed" on public.distributors;
create policy "distributors read authed" on public.distributors
  for select to authenticated using (true);

drop policy if exists "distributors del authed" on public.distributors;
create policy "distributors del authed" on public.distributors
  for delete to authenticated using (true);

-- ============================================================================
--  შემოწმება: select name, phone, region, monthly from public.distributors order by created_at desc;
-- ============================================================================
