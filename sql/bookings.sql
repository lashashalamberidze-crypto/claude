-- ============================================================================
--  RAM IMPEX — ჯავშნები / დისტრიბუტორის მიწოდების სია
--  გაუშვი Supabase Dashboard → SQL Editor-ში ერთხელ.
-- ============================================================================

-- დისტრიბუტორის პარამეტრები (თითოს თავისი ხარჯები/ფასები/მარშრუტები)
alter table public.distributors add column if not exists bset jsonb;
--  bset = {
--    base:'სამტრედია', l100:12, fuelP:3.8, costKg:1.8, retailKg:2.2,
--    iban:'GE..', bank:'', payinfo:'',
--    routes:[ {name:'გურია-აჭარა', munis:[{m:'ჩოხატაური',km:50},{m:'ოზურგეთი',km:55}]} ]
--  }

-- ჯავშნები (მიწოდების სია) — თითო მყიდველი
create table if not exists public.bookings (
  id             text primary key,
  created_at     timestamptz default now(),
  distributor_id text,      -- distributors.id
  route          text,      -- მარშრუტის სახელი
  municipality   text,      -- მუნიციპალიტეტი (მარშრუტიდან)
  cust_name      text,      -- მყიდველის სახელი გვარი
  phone          text,
  address        text,
  contact2       text,      -- დამატ. საკონტაქტო
  bag_size       numeric,   -- ტომრის ზომა კგ (10 / 40)
  qty            numeric,   -- რაოდენობა (ტომარა)
  km             numeric,   -- ხელით ჩაწერილი მუნიციპალიტეტის კმ (როცა სიაში არ არის)
  paid           boolean default false,  -- 💰 ჩარიცხულია
  delivered      boolean default false,  -- 🚚 მიტანილია
  paid_amount    numeric default 0,      -- ჩარიცხული თანხა ₾
  docs           jsonb,     -- დოკუმენტები (გადარიცხვა და ა.შ.)
  note           text
);
create index if not exists bookings_dist_idx on public.bookings (distributor_id);
alter table public.bookings enable row level security;
drop policy if exists "bookings all authed" on public.bookings;
create policy "bookings all authed" on public.bookings
  for all to authenticated using (true) with check (true);

-- ============================================================================
--  შემოწმება:
--   select cust_name, municipality, qty, paid, delivered from public.bookings order by created_at desc;
-- ============================================================================
