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
-- იყენებს pg_cron + pg_net ექსთენშენებს (Supabase-ზე ჩართვადია).
-- send-sms edge function უნდა იყოს deploy-ული.
-- ============================================================================
create extension if not exists pg_cron;
create extension if not exists pg_net;

create or replace function public.dispatch_review_sms()
returns void language plpgsql security definer as $$
declare
  r record;
  v_url  text := 'https://debbzurtkrlsknhpqvfm.supabase.co/functions/v1/send-sms';
  -- ⚠️ ANON KEY — იგივე რაც index.html-ში (საჯაროა). როტაციისას შეცვალე აქაც.
  v_key  text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYmJ6dXJ0a3Jsc2tuaHBxdmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzOTk4NDYsImV4cCI6MjA5MTk3NTg0Nn0.Qxhib7OtwJyWHm58_MxJHB8rAkydOwgq60ktceEmAWo';
  v_msg  text;
  v_link text;
begin
  for r in
    select id, customer_phone, master_name, master_id
      from public.contacts
     where review_sms_sent = false
       and customer_phone is not null
       and send_review_at is not null
       and send_review_at <= now()
     limit 50
  loop
    v_link := 'https://gverdshi.ge/?shefaseba=1'
              || case when r.master_id is not null
                      then '&m=' || r.master_id::text else '' end;
    v_msg := 'gverdshi.ge: gamarjoba! tu ' || coalesce(r.master_name, 'ostatma')
             || '-ma ushvelat shesrula samushao, datove shefaseba: ' || v_link || ' . madloba!';

    perform net.http_post(
      url     := v_url,
      headers := jsonb_build_object(
                   'Content-Type', 'application/json',
                   'Authorization', 'Bearer ' || v_key,
                   'apikey', v_key),
      body    := jsonb_build_object('phone', r.customer_phone, 'message', v_msg)
    );

    update public.contacts
       set review_sms_sent = true, status = 'review_sent'
     where id = r.id;
  end loop;
end;
$$;

-- ყოველ 15 წუთში ვამოწმებთ ვის დაუდგა 3 დღე
select cron.unschedule('gverdshi-review-sms')
  where exists (select 1 from cron.job where jobname = 'gverdshi-review-sms');
select cron.schedule('gverdshi-review-sms', '*/15 * * * *', $$ select public.dispatch_review_sms(); $$);

-- ============================================================================
-- დასრულდა. შემოწმება:
--   select jobname, schedule, active from cron.job;              -- cron დგას?
--   select id, send_review_at, review_sms_sent from public.contacts
--     order by created_at desc limit 10;                         -- განრიგი ჩანს?
-- ============================================================================
