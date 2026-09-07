-- ═══════════════════════════════════════════════════════════════════════════
--  myevents.ge — ქორწილების დაგეგმვის პლატფორმის ბაზა (Supabase / Postgres)
--
--  გაუშვი ერთხელ: Supabase Dashboard → SQL Editor → Run.
--  სკრიპტი იდემპოტენტურია — მრავალჯერ გაშვებაც უსაფრთხოა.
--
--  ცხრილების პრეფიქსი `ev_` — რომ არსებულ (agro) ცხრილებს არ შეეხოს.
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- 0. დამხმარე ფუნქციები
-- ───────────────────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ადმინის შემოწმება RLS-ის შიგნით (security definer → არ ხვდება რეკურსიაში)
create or replace function public.ev_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.ev_profiles p
                 where p.user_id = auth.uid() and p.role = 'admin');
$$;

create or replace function public.ev_touch()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- ───────────────────────────────────────────────────────────────────────────
-- 1. პროფილები — ვინ არის მომხმარებელი (წყვილი / ვენდორი / ადმინი)
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  city        text,
  role        text not null default 'couple',   -- couple | vendor | admin
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 2. ქორწილი (ღონისძიება)
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_weddings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text,
  bride_name    text,
  groom_name    text,
  event_date    date,
  event_time    text,
  venue_name    text,
  venue_address text,
  venue_map     text,
  guests_target int  default 100,
  budget        numeric(12,2) default 0,
  currency      text default 'GEL',
  cover_url     text,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 3. მაგიდები (დარბაზის გეგმა)
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_tables (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.ev_weddings(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null default 'მაგიდა',
  shape       text not null default 'round',   -- round | rect | head
  seats       int  not null default 10,
  x           numeric default 100,
  y           numeric default 100,
  rotation    int  default 0,
  color       text default '#c9a227',
  sort        int  default 0,
  created_at  timestamptz default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 4. სტუმრები
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_guests (
  id           uuid primary key default gen_random_uuid(),
  wedding_id   uuid not null references public.ev_weddings(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  full_name    text not null,
  phone        text,
  email        text,
  side         text default 'both',      -- bride | groom | both
  group_name   text,                     -- ოჯახი / კოლეგები / მეგობრები ...
  seats        int  default 1,           -- რამდენი ადგილი უჭირავს (თან მოჰყავს)
  rsvp         text default 'pending',   -- pending | yes | no | maybe
  rsvp_at      timestamptz,
  rsvp_count   int,                      -- სტუმარმა რამდენი დაადასტურა
  table_id     uuid references public.ev_tables(id) on delete set null,
  seat_no      int,
  food_pref    text,                     -- ჩვეულებრივი / ვეგეტარიანული / ...
  is_kid       boolean default false,
  notes        text,
  invite_token text unique default encode(gen_random_bytes(8),'hex'),
  sms_sent_at  timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 5. ციფრული მოსაწვევი
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_invitations (
  id            uuid primary key default gen_random_uuid(),
  wedding_id    uuid not null references public.ev_weddings(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  slug          text unique not null,
  template      text default 'gold',      -- gold | blush | botanic | night | minimal
  headline      text,
  names         text,
  date_text     text,
  time_text     text,
  place_text    text,
  address_text  text,
  map_url       text,
  message       text,
  photo_url     text,
  music_url     text,
  rsvp_on       boolean default true,
  rsvp_deadline date,
  published     boolean default false,
  views         int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- მიგრაცია: ღონისძიების თარიღი მოსაწვევშივე (საჯარო გვერდს ev_weddings-თან წვდომა არ აქვს)
alter table public.ev_invitations add column if not exists event_date date;

-- RSVP პასუხების ჟურნალი (საჯარო ფორმიდან)
create table if not exists public.ev_rsvp_log (
  id            uuid primary key default gen_random_uuid(),
  invitation_id uuid references public.ev_invitations(id) on delete cascade,
  wedding_id    uuid references public.ev_weddings(id) on delete cascade,
  guest_id      uuid references public.ev_guests(id) on delete set null,
  name          text,
  phone         text,
  answer        text,
  guests_count  int default 1,
  message       text,
  created_at    timestamptz default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 6. SMS ჟურნალი
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_sms_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  wedding_id  uuid references public.ev_weddings(id) on delete cascade,
  guest_id    uuid references public.ev_guests(id) on delete set null,
  guest_name  text,
  phone       text,
  text        text,
  kind        text,     -- invite | reminder | thanks | custom
  status      text,     -- sent | failed
  error       text,
  msg_id      text,
  created_at  timestamptz default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 7. ვენდორები — რესტორნები, ბენდები, ფოტოგრაფები და ა.შ.
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_vendors (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  category      text not null,          -- restaurant | band | photo | video | decor | cake | makeup | transport | host | dance
  name          text not null,
  city          text,
  address       text,
  phone         text,
  email         text,
  website       text,
  instagram     text,
  description   text,
  price_from    numeric(12,2),
  price_to      numeric(12,2),
  price_unit    text default 'per_person',  -- per_person | per_event | per_hour
  capacity_min  int,
  capacity_max  int,
  tags          text[] default '{}',    -- ჟანრები / სერვისები / კერძები
  cover_url     text,
  photos        jsonb default '[]'::jsonb,
  videos        jsonb default '[]'::jsonb,
  menu_url      text,
  rating        numeric(3,2) default 0,
  reviews_count int default 0,
  status        text default 'pending', -- pending | approved | rejected
  reject_reason text,
  featured      boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 8. შეკვეთები / ჯავშნები
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_bookings (
  id            uuid primary key default gen_random_uuid(),
  vendor_id     uuid not null references public.ev_vendors(id) on delete cascade,
  customer_id   uuid not null references auth.users(id) on delete cascade,
  wedding_id    uuid references public.ev_weddings(id) on delete set null,
  customer_name text,
  phone         text,
  event_date    date,
  guests_count  int,
  budget        numeric(12,2),
  message       text,
  vendor_reply  text,
  status        text default 'new',   -- new | accepted | declined | cancelled | done
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 9. შეფასებები
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_reviews (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references public.ev_vendors(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  author_name text,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz default now(),
  unique (vendor_id, user_id)
);

-- ───────────────────────────────────────────────────────────────────────────
-- 10. სამოქმედო გეგმა და ბიუჯეტი
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.ev_checklist (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.ev_weddings(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  category    text,
  due_date    date,
  done        boolean default false,
  sort        int default 0,
  created_at  timestamptz default now()
);

create table if not exists public.ev_expenses (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.ev_weddings(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  category    text,
  planned     numeric(12,2) default 0,
  paid        numeric(12,2) default 0,
  vendor_id   uuid references public.ev_vendors(id) on delete set null,
  created_at  timestamptz default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- 11. ინდექსები
-- ───────────────────────────────────────────────────────────────────────────
create index if not exists ev_weddings_user_idx    on public.ev_weddings (user_id);
create index if not exists ev_guests_wed_idx       on public.ev_guests (wedding_id);
create index if not exists ev_guests_table_idx     on public.ev_guests (table_id);
create index if not exists ev_tables_wed_idx       on public.ev_tables (wedding_id);
create index if not exists ev_inv_slug_idx         on public.ev_invitations (slug);
create index if not exists ev_inv_wed_idx          on public.ev_invitations (wedding_id);
create index if not exists ev_sms_user_idx         on public.ev_sms_log (user_id, created_at desc);
create index if not exists ev_vendors_cat_idx      on public.ev_vendors (category, status);
create index if not exists ev_vendors_user_idx     on public.ev_vendors (user_id);
create index if not exists ev_bookings_vendor_idx  on public.ev_bookings (vendor_id, created_at desc);
create index if not exists ev_bookings_cust_idx    on public.ev_bookings (customer_id, created_at desc);
create index if not exists ev_reviews_vendor_idx   on public.ev_reviews (vendor_id);
create index if not exists ev_checklist_wed_idx    on public.ev_checklist (wedding_id);
create index if not exists ev_expenses_wed_idx     on public.ev_expenses (wedding_id);

-- updated_at ტრიგერები
do $$ declare t text; begin
  foreach t in array array['ev_profiles','ev_weddings','ev_guests','ev_invitations','ev_vendors','ev_bookings'] loop
    execute format('drop trigger if exists %I_touch on public.%I;', t, t);
    execute format('create trigger %I_touch before update on public.%I
                    for each row execute function public.ev_touch();', t, t);
  end loop;
end $$;

-- ═══════════════════════════════════════════════════════════════════════════
--  RLS — მონაცემთა დაცვა
-- ═══════════════════════════════════════════════════════════════════════════
do $$ declare t text; begin
  foreach t in array array['ev_profiles','ev_weddings','ev_tables','ev_guests','ev_invitations',
                           'ev_rsvp_log','ev_sms_log','ev_vendors','ev_bookings','ev_reviews',
                           'ev_checklist','ev_expenses'] loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- 1) მხოლოდ მფლობელის ცხრილები (user_id = auth.uid())
do $$ declare t text; begin
  foreach t in array array['ev_profiles','ev_weddings','ev_tables','ev_guests','ev_invitations',
                           'ev_sms_log','ev_checklist','ev_expenses'] loop
    execute format('drop policy if exists own_select on public.%I;', t);
    execute format('drop policy if exists own_insert on public.%I;', t);
    execute format('drop policy if exists own_update on public.%I;', t);
    execute format('drop policy if exists own_delete on public.%I;', t);
    execute format('create policy own_select on public.%I for select to authenticated using (user_id = (select auth.uid()));', t);
    execute format('create policy own_insert on public.%I for insert to authenticated with check (user_id = (select auth.uid()));', t);
    execute format('create policy own_update on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));', t);
    execute format('create policy own_delete on public.%I for delete to authenticated using (user_id = (select auth.uid()));', t);
  end loop;
end $$;

-- 2) მოსაწვევი — გამოქვეყნებულს ყველა ხედავს (SMS-ის ლინკი ავტორიზაციის გარეშე იხსნება)
drop policy if exists inv_public_read on public.ev_invitations;
create policy inv_public_read on public.ev_invitations
  for select to anon, authenticated using (published = true);

-- 3) RSVP ჟურნალი — ჩაწერა საჯარო ფორმიდან (RPC), კითხვა მხოლოდ ქორწილის მფლობელს
drop policy if exists rsvp_owner_read on public.ev_rsvp_log;
create policy rsvp_owner_read on public.ev_rsvp_log
  for select to authenticated
  using (exists (select 1 from public.ev_weddings w
                 where w.id = ev_rsvp_log.wedding_id and w.user_id = (select auth.uid())));

drop policy if exists rsvp_owner_delete on public.ev_rsvp_log;
create policy rsvp_owner_delete on public.ev_rsvp_log
  for delete to authenticated
  using (exists (select 1 from public.ev_weddings w
                 where w.id = ev_rsvp_log.wedding_id and w.user_id = (select auth.uid())));

-- 4) ვენდორები — დადასტურებულს ყველა ხედავს; მფლობელი და ადმინი მართავს
drop policy if exists vendor_public_read on public.ev_vendors;
create policy vendor_public_read on public.ev_vendors
  for select to anon, authenticated
  using (status = 'approved' or user_id = (select auth.uid()) or public.ev_is_admin());

drop policy if exists vendor_owner_insert on public.ev_vendors;
create policy vendor_owner_insert on public.ev_vendors
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists vendor_owner_update on public.ev_vendors;
create policy vendor_owner_update on public.ev_vendors
  for update to authenticated
  using (user_id = (select auth.uid()) or public.ev_is_admin())
  with check (user_id = (select auth.uid()) or public.ev_is_admin());

drop policy if exists vendor_owner_delete on public.ev_vendors;
create policy vendor_owner_delete on public.ev_vendors
  for delete to authenticated
  using (user_id = (select auth.uid()) or public.ev_is_admin());

-- ვენდორს არ შეუძლია თავად დაიმტკიცოს სტატუსი — მოდერაცია ტრიგერით
create or replace function public.ev_vendor_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.ev_is_admin() then return new; end if;
  if tg_op = 'INSERT' then
    new.status := 'pending'; new.featured := false;
    new.rating := 0; new.reviews_count := 0;
  else
    -- პროფილის რედაქტირებისას სტატუსი ბრუნდება მოდერაციაში
    if new.status is distinct from old.status then new.status := old.status; end if;
    new.featured := old.featured;
    new.rating := old.rating; new.reviews_count := old.reviews_count;
  end if;
  return new;
end $$;

drop trigger if exists ev_vendor_guard_trg on public.ev_vendors;
create trigger ev_vendor_guard_trg before insert or update on public.ev_vendors
  for each row execute function public.ev_vendor_guard();

-- 5) ჯავშნები — მომხმარებელი ხედავს თავისას, ვენდორი — თავისი ობიექტისას
drop policy if exists booking_read on public.ev_bookings;
create policy booking_read on public.ev_bookings
  for select to authenticated
  using (customer_id = (select auth.uid())
      or exists (select 1 from public.ev_vendors v where v.id = ev_bookings.vendor_id and v.user_id = (select auth.uid()))
      or public.ev_is_admin());

drop policy if exists booking_insert on public.ev_bookings;
create policy booking_insert on public.ev_bookings
  for insert to authenticated with check (customer_id = (select auth.uid()));

drop policy if exists booking_update on public.ev_bookings;
create policy booking_update on public.ev_bookings
  for update to authenticated
  using (customer_id = (select auth.uid())
      or exists (select 1 from public.ev_vendors v where v.id = ev_bookings.vendor_id and v.user_id = (select auth.uid())))
  with check (customer_id = (select auth.uid())
      or exists (select 1 from public.ev_vendors v where v.id = ev_bookings.vendor_id and v.user_id = (select auth.uid())));

drop policy if exists booking_delete on public.ev_bookings;
create policy booking_delete on public.ev_bookings
  for delete to authenticated using (customer_id = (select auth.uid()));

-- 6) შეფასებები — ყველა კითხულობს, ავტორი წერს
drop policy if exists review_read on public.ev_reviews;
create policy review_read on public.ev_reviews for select to anon, authenticated using (true);

drop policy if exists review_insert on public.ev_reviews;
create policy review_insert on public.ev_reviews
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists review_update on public.ev_reviews;
create policy review_update on public.ev_reviews
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists review_delete on public.ev_reviews;
create policy review_delete on public.ev_reviews
  for delete to authenticated using (user_id = (select auth.uid()) or public.ev_is_admin());

-- რეიტინგის გადათვლა
create or replace function public.ev_recalc_rating()
returns trigger language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := coalesce(new.vendor_id, old.vendor_id);
  update public.ev_vendors t set
    rating = coalesce((select round(avg(r.rating)::numeric,2) from public.ev_reviews r where r.vendor_id = v),0),
    reviews_count = (select count(*) from public.ev_reviews r where r.vendor_id = v)
  where t.id = v;
  return null;
end $$;

drop trigger if exists ev_reviews_rating_trg on public.ev_reviews;
create trigger ev_reviews_rating_trg after insert or update or delete on public.ev_reviews
  for each row execute function public.ev_recalc_rating();

-- ადმინს ყველა ქორწილის/სტუმრის ნახვა არ სჭირდება — ადმინი მხოლოდ ვენდორებს მოდერირებს.

-- ═══════════════════════════════════════════════════════════════════════════
--  საჯარო RPC — მოსაწვევის გვერდი (ავტორიზაციის გარეშე)
-- ═══════════════════════════════════════════════════════════════════════════

-- სტუმრის სახელი პერსონალური ლინკიდან (?g=token) — მხოლოდ სახელი და ადგილები
create or replace function public.ev_guest_by_token(p_slug text, p_token text)
returns json language plpgsql stable security definer set search_path = public as $$
declare g record; inv record;
begin
  select * into inv from public.ev_invitations where slug = p_slug and published limit 1;
  if inv is null then return null; end if;
  select id, full_name, seats, rsvp, table_id into g
    from public.ev_guests where invite_token = p_token and wedding_id = inv.wedding_id limit 1;
  if g is null then return null; end if;
  return json_build_object('id', g.id, 'full_name', g.full_name, 'seats', g.seats, 'rsvp', g.rsvp);
end $$;

-- RSVP პასუხის მიღება
create or replace function public.ev_rsvp_submit(
  p_slug text, p_token text, p_name text, p_phone text,
  p_answer text, p_count int, p_message text)
returns json language plpgsql security definer set search_path = public as $$
declare inv record; g record; ans text;
begin
  ans := lower(coalesce(p_answer,''));
  if ans not in ('yes','no','maybe') then
    return json_build_object('ok', false, 'error', 'არასწორი პასუხი');
  end if;

  select * into inv from public.ev_invitations where slug = p_slug and published limit 1;
  if inv is null then return json_build_object('ok', false, 'error', 'მოსაწვევი ვერ მოიძებნა'); end if;
  if not inv.rsvp_on then return json_build_object('ok', false, 'error', 'პასუხის მიღება დახურულია'); end if;
  if inv.rsvp_deadline is not null and inv.rsvp_deadline < current_date then
    return json_build_object('ok', false, 'error', 'პასუხის ვადა ამოიწურა');
  end if;

  if p_token is not null and p_token <> '' then
    select * into g from public.ev_guests
      where invite_token = p_token and wedding_id = inv.wedding_id limit 1;
  end if;

  if g.id is not null then
    update public.ev_guests set
      rsvp = ans,
      rsvp_at = now(),
      rsvp_count = greatest(coalesce(p_count,1),0),
      phone = coalesce(nullif(p_phone,''), phone),
      updated_at = now()
    where id = g.id;
  end if;

  insert into public.ev_rsvp_log (invitation_id, wedding_id, guest_id, name, phone, answer, guests_count, message)
  values (inv.id, inv.wedding_id, g.id,
          coalesce(nullif(p_name,''), g.full_name), p_phone, ans,
          greatest(coalesce(p_count,1),0), left(coalesce(p_message,''), 600));

  return json_build_object('ok', true, 'guest', coalesce(g.full_name, p_name));
end $$;

-- ნახვების მთვლელი
create or replace function public.ev_invite_view(p_slug text)
returns void language sql security definer set search_path = public as $$
  update public.ev_invitations set views = coalesce(views,0) + 1 where slug = p_slug and published;
$$;

grant execute on function public.ev_guest_by_token(text,text) to anon, authenticated;
grant execute on function public.ev_rsvp_submit(text,text,text,text,text,int,text) to anon, authenticated;
grant execute on function public.ev_invite_view(text) to anon, authenticated;
grant execute on function public.ev_is_admin() to authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
--  Storage — სურათების ბაკეტი (რესტორნების/ბენდების ფოტოები, მოსაწვევის ფონი)
-- ═══════════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('myevents', 'myevents', true)
on conflict (id) do update set public = true;

drop policy if exists myevents_public_read on storage.objects;
create policy myevents_public_read on storage.objects
  for select to anon, authenticated using (bucket_id = 'myevents');

-- ავტორიზებული წერს მხოლოდ თავის საქაღალდეში: myevents/<uid>/...
drop policy if exists myevents_own_write on storage.objects;
create policy myevents_own_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'myevents' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists myevents_own_update on storage.objects;
create policy myevents_own_update on storage.objects
  for update to authenticated
  using (bucket_id = 'myevents' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists myevents_own_delete on storage.objects;
create policy myevents_own_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'myevents' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ═══════════════════════════════════════════════════════════════════════════
--  ადმინის დანიშვნა (გაუშვი ხელით, შენი ელფოსტით):
--    update public.ev_profiles set role = 'admin'
--    where user_id = (select id from auth.users where email = 'you@example.com');
-- ═══════════════════════════════════════════════════════════════════════════
