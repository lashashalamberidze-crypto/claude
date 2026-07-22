-- ============================================================================
-- gverdshi.ge — Supabase სქემა (კანონიკური)
--
-- უსაფრთხოა არსებულ პროექტზე გასაშვებადაც: ყველაფერი IF NOT EXISTS / ADD
-- COLUMN IF NOT EXISTS / CREATE OR REPLACE-ია, ამიტომ მონაცემებს არ შლის.
--
-- გაშვება: Supabase → SQL Editor → ჩასვი ეს ფაილი მთლიანად → Run.
--
-- სვეტები ზუსტად ემთხვევა იმას, რასაც index.html წერს/კითხულობს:
--   masters, customers, contacts, waitlist, reviews
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. MASTERS — ოსტატები
-- ---------------------------------------------------------------------------
create table if not exists public.masters (
  id                uuid primary key default gen_random_uuid(),
  first_name        text,
  last_name         text,
  phone             text,
  category          text,
  areas             text[] default '{}',
  price_per_hour    numeric,
  experience_years  int,
  bio               text,
  is_pro            boolean default false,
  rating            numeric,
  reviews_count     int default 0,
  city              text default 'batumi',
  avatar_url        text,
  status            text default 'pending',   -- pending | approved | rejected
  created_at        timestamptz default now()
);
alter table public.masters add column if not exists areas          text[] default '{}';
alter table public.masters add column if not exists is_pro         boolean default false;
alter table public.masters add column if not exists rating         numeric;
alter table public.masters add column if not exists reviews_count  int default 0;
alter table public.masters add column if not exists avatar_url     text;
alter table public.masters add column if not exists status         text default 'pending';
create index if not exists masters_city_status_idx on public.masters (city, status);

-- ---------------------------------------------------------------------------
-- 2. CUSTOMERS — კლიენტები
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  phone       text unique,
  city        text default 'batumi',
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 3. CONTACTS — კონტაქტის მოთხოვნები (+ შეფასების SMS განრიგი)
--    index.html ერთ insert-ს აკეთებს ამ სქემით.
-- ---------------------------------------------------------------------------
create table if not exists public.contacts (
  id               uuid primary key default gen_random_uuid(),
  master_id        uuid references public.masters(id) on delete set null,
  customer_id      uuid references public.customers(id) on delete set null,
  master_name      text,
  master_phone     text,
  customer_name    text,
  customer_phone   text,
  contact_method   text default 'whatsapp',
  category         text,
  city             text default 'batumi',
  status           text default 'pending',          -- pending | review_sent
  send_review_at   timestamptz,                      -- როდის უნდა გაიგზავნოს შეფასების SMS
  review_sms_sent  boolean default false,
  created_at       timestamptz default now()
);
-- არსებულ ცხრილს დავამატოთ ის სვეტები, რაც კოდს სჭირდება:
alter table public.contacts add column if not exists master_name     text;
alter table public.contacts add column if not exists master_phone    text;
alter table public.contacts add column if not exists customer_name   text;
alter table public.contacts add column if not exists customer_phone  text;
alter table public.contacts add column if not exists city            text default 'batumi';
alter table public.contacts add column if not exists status          text default 'pending';
alter table public.contacts add column if not exists send_review_at  timestamptz;
alter table public.contacts add column if not exists review_sms_sent boolean default false;
create index if not exists contacts_due_idx
  on public.contacts (send_review_at)
  where review_sms_sent = false;

-- ---------------------------------------------------------------------------
-- 3b. BOOKINGS — ჯავშნები (თარიღი/დროის მონაკვეთით)
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  service         text,
  city            text default 'batumi',
  booking_date    date,
  time_slot       text,
  address         text,
  customer_name   text,
  customer_phone  text,
  note            text,
  master_id       uuid references public.masters(id) on delete set null,
  status          text default 'new',   -- new | confirmed | done | cancelled
  created_at      timestamptz default now()
);
create index if not exists bookings_date_idx on public.bookings (booking_date, status);

alter table public.bookings enable row level security;
drop policy if exists bookings_anon_insert on public.bookings;
create policy bookings_anon_insert on public.bookings
  for insert with check (true);

-- ---------------------------------------------------------------------------
-- 4. WAITLIST — მოცდის რიგი (მომავალი სერვისები)
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id                uuid primary key default gen_random_uuid(),
  email             text,
  service_interest  text,
  language          text,
  city              text default 'batumi',
  created_at        timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 5. REVIEWS — შეფასებები
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id                    uuid primary key default gen_random_uuid(),
  master_id             uuid references public.masters(id) on delete cascade,
  rating                int check (rating between 1 and 5),
  rating_timing         int,
  rating_quality        int,
  rating_price          int,
  rating_communication  int,
  text                  text,
  author_name           text,
  status                text default 'pending',   -- pending | approved | rejected
  created_at            timestamptz default now()
);
alter table public.reviews add column if not exists rating_timing        int;
alter table public.reviews add column if not exists rating_quality       int;
alter table public.reviews add column if not exists rating_price         int;
alter table public.reviews add column if not exists rating_communication int;
alter table public.reviews add column if not exists author_name          text;
alter table public.reviews add column if not exists status               text default 'pending';
create index if not exists reviews_master_status_idx on public.reviews (master_id, status);

-- ============================================================================
-- ROW LEVEL SECURITY — საჯარო საიტი anon key-ით მუშაობს
-- ============================================================================
alter table public.masters   enable row level security;
alter table public.customers enable row level security;
alter table public.contacts  enable row level security;
alter table public.waitlist  enable row level security;
alter table public.reviews   enable row level security;

-- masters: საჯაროდ ჩანს მხოლოდ დამტკიცებული; ვინც აგზავნის რეგისტრაციას — anon insert
drop policy if exists masters_public_read on public.masters;
create policy masters_public_read on public.masters
  for select using (status = 'approved');

drop policy if exists masters_anon_insert on public.masters;
create policy masters_anon_insert on public.masters
  for insert with check (true);   -- app ინახავს status='pending'-ით; მოდერაცია admin-ით

-- customers: anon-ს შეუძლია ჩაწერა და საკუთარი ჩანაწერის მოძებნა ტელეფონით
drop policy if exists customers_anon_insert on public.customers;
create policy customers_anon_insert on public.customers
  for insert with check (true);
drop policy if exists customers_anon_read on public.customers;
create policy customers_anon_read on public.customers
  for select using (true);

-- contacts: anon insert (კონტაქტის მოთხოვნა)
drop policy if exists contacts_anon_insert on public.contacts;
create policy contacts_anon_insert on public.contacts
  for insert with check (true);

-- waitlist: anon insert
drop policy if exists waitlist_anon_insert on public.waitlist;
create policy waitlist_anon_insert on public.waitlist
  for insert with check (true);

-- reviews: anon insert (status=pending), საჯაროდ ჩანს მხოლოდ დამტკიცებული
drop policy if exists reviews_anon_insert on public.reviews;
create policy reviews_anon_insert on public.reviews
  for insert with check (true);
drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews
  for select using (status = 'approved');

-- ============================================================================
-- RATING AGGREGATION — masters.rating / reviews_count ავტომატურად ითვლება
-- დამტკიცებული (status='approved') შეფასებებიდან.  (#2)
-- ============================================================================
create or replace function public.recalc_master_rating(p_master uuid)
returns void language sql as $$
  update public.masters m
     set rating = sub.avg_rating,
         reviews_count = sub.cnt
    from (
      select coalesce(round(avg(rating)::numeric, 1), 0) as avg_rating,
             count(*) as cnt
        from public.reviews
       where master_id = p_master and status = 'approved'
    ) sub
   where m.id = p_master;
$$;

create or replace function public.reviews_after_change()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'DELETE') then
    if old.master_id is not null then perform public.recalc_master_rating(old.master_id); end if;
    return old;
  end if;
  if new.master_id is not null then perform public.recalc_master_rating(new.master_id); end if;
  if (tg_op = 'UPDATE' and old.master_id is not null and old.master_id <> new.master_id) then
    perform public.recalc_master_rating(old.master_id);
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_recalc_trg on public.reviews;
create trigger reviews_recalc_trg
  after insert or update or delete on public.reviews
  for each row execute function public.reviews_after_change();

-- ============================================================================
-- CRON — 3 დღეში კლიენტს ავტომატურად ეგზავნება შეფასების SMS.  (#4)
--
-- ⚠️ ამ ფაილს cron *არ* ემატება.
-- პროექტს უკვე აქვს საკუთარი, გამართული პიპლაინი:
--   cron job:      send-pending-reviews-15min  (*/15 * * * *)
--   edge function: send-pending-reviews        (x-cron-secret-ით დაცული)
-- იგი კითხულობს public.contacts-ს (status='pending', send_review_at <= now())
-- და აგზავნის შეფასების SMS-ს.
--
-- აქ მეორე cron-ის დამატება დუბლიკატ SMS-ს გამოიწვევდა, ამიტომ გამორთულია.
-- contacts insert-ს index.html აკეთებს ამ ფაილში აღწერილი სვეტებით
-- (customer_phone, send_review_at, status='pending', master_id/name…),
-- რაც send-pending-reviews function-ს ჭირდება.
-- ============================================================================

-- (განზრახ ცარიელია — cron პროექტში უკვე დგას.)

-- ============================================================================
-- დასრულდა. შემოწმება:
--   select jobname, schedule, active from cron.job;              -- ერთი cron?
--   select id, send_review_at, status from public.contacts
--     order by created_at desc limit 10;                         -- განრიგი ჩანს?
-- ============================================================================
