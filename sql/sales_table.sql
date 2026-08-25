-- ============================================================================
--  RAM IMPEX — გაყიდვების (sales) ცხრილი + დოკუმენტების საცავი
--  გაუშვი Supabase Dashboard → SQL Editor-ში ერთხელ.
--
--  რას აკეთებს:
--   1) ქმნის public.sales ცხრილს (ვის რა მიეყიდა, გადახდები, დოკუმენტები).
--   2) რთავს RLS-ს და ამატებს policy-ს ავტორიზებული ადმინისთვის.
--   3) ქმნის Storage bucket-ს „sale-docs" (ინვოისი/ფაქტურა/გადახდა/სერტიფიკატი).
-- ============================================================================

create table if not exists public.sales (
  id          text primary key,
  date        date,
  cust_name   text,          -- მყიდველი
  cust_id     text,          -- ს/კ
  cust_phone  text,
  direction   text,          -- პროდუქტის მიმართულება (ჯგუფი)
  code        text,          -- პროდუქტის კოდი
  name        text,          -- პროდუქტის დასახელება
  qty         numeric,       -- რაოდენობა
  unit        text,          -- ერთეული (კგ/ცალი/ტონა/მ)
  price       numeric,       -- ერთეულის ფასი ₾
  total       numeric,       -- ჯამი ₾
  paid        numeric,       -- გადახდილი ₾
  status      text,          -- paid | part | due
  note        text,
  docs        jsonb default '{}'::jsonb,  -- {invoice,factura,payment,cert} → URL
  created_at  timestamptz default now()
);

create index if not exists sales_date_idx on public.sales (date desc);

alter table public.sales enable row level security;

drop policy if exists "sales all authed" on public.sales;
create policy "sales all authed" on public.sales
  for all to authenticated using (true) with check (true);

-- ---------- Storage bucket დოკუმენტებისთვის ----------
insert into storage.buckets (id, name, public)
values ('sale-docs', 'sale-docs', true)
on conflict (id) do nothing;

drop policy if exists "sale-docs read"   on storage.objects;
drop policy if exists "sale-docs insert" on storage.objects;
drop policy if exists "sale-docs update" on storage.objects;
drop policy if exists "sale-docs delete" on storage.objects;

create policy "sale-docs read"   on storage.objects
  for select using (bucket_id = 'sale-docs');
create policy "sale-docs insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'sale-docs');
create policy "sale-docs update" on storage.objects
  for update to authenticated using (bucket_id = 'sale-docs');
create policy "sale-docs delete" on storage.objects
  for delete to authenticated using (bucket_id = 'sale-docs');

-- ============================================================================
--  შემოწმება: select * from public.sales order by date desc limit 5;
-- ============================================================================
