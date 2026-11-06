-- ============================================================================
--  AgroInTechSol — ამწონველის ცალკე ლოგინი + საერთო ფერმის მონაცემები
--  ────────────────────────────────────────────────────────────────────────
--  მოდელი:
--   • ფერმის მფლობელი = Supabase ანგარიში (როგორც დღემდე). მისი user_id = farm.
--   • ამწონველი = ცალკე Supabase ანგარიში (თავისი email/პაროლი), დაკავშირებული
--     მფლობელთან farm_members-ით. ის წერს/კითხულობს მფლობელის მონაცემებს
--     მხოლოდ აწონვის ცხრილებზე. სხვა მოდულები მფლობელის რჩება.
--
--  გაუშვი Supabase → SQL Editor-ში ერთხელ.
--  ასევე: Supabase → Authentication → Providers → Email →
--         გამორთე „Confirm email" (რომ ახალი ამწონველი მაშინვე შევიდეს).
-- ============================================================================

-- 1) ფერმის წევრები (ამწონველები) ─────────────────────────────────────────
create table if not exists public.farm_members (
  id         uuid primary key default gen_random_uuid(),
  owner_uid  uuid not null,            -- ფერმის მფლობელის user_id
  member_uid uuid not null unique,     -- ამწონველის Supabase user_id
  name       text,
  email      text,
  role       text default 'weigher',
  created_at timestamptz default now()
);
alter table public.farm_members enable row level security;

drop policy if exists fm_owner_all  on public.farm_members;
drop policy if exists fm_self_read  on public.farm_members;
-- მფლობელი მართავს თავის წევრებს
create policy fm_owner_all on public.farm_members
  for all to authenticated
  using (owner_uid = (select auth.uid()))
  with check (owner_uid = (select auth.uid()));
-- ამწონველი კითხულობს თავის ჩანაწერს (რომ გაიგოს რომელ ფერმას ეკუთვნის)
create policy fm_self_read on public.farm_members
  for select to authenticated
  using (member_uid = (select auth.uid()));

-- 2) farm_owner(u): აბრუნებს ფერმის მფლობელის uid-ს ─────────────────────────
--    ამწონველზე → მფლობელის uid; მფლობელზე → თავისივე uid.
create or replace function public.farm_owner(u uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select coalesce((select owner_uid from public.farm_members where member_uid = u limit 1), u);
$$;

-- 3) აწონვის ცხრილები — წევრსაც მიუწვდება მფლობელის სტრიქონებზე ──────────────
--    (მფლობელზე farm_owner(uid)=uid, ამიტომ მისი ქცევა უცვლელია)
do $$
declare
  t text;
  full_tables text[] := array['harvest_sessions','krepa_pickers','cold_stock','agro_blocks','agro_rows'];
begin
  foreach t in array full_tables loop
    if not exists (select 1 from information_schema.tables where table_schema='public' and table_name=t) then
      raise notice 'ცხრილი public.% არ არსებობს — გამოტოვებულია', t; continue;
    end if;
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "own_rows_select" on public.%I;', t);
    execute format('drop policy if exists "own_rows_insert" on public.%I;', t);
    execute format('drop policy if exists "own_rows_update" on public.%I;', t);
    execute format('drop policy if exists "own_rows_delete" on public.%I;', t);
    execute format('drop policy if exists "farm_select" on public.%I;', t);
    execute format('drop policy if exists "farm_insert" on public.%I;', t);
    execute format('drop policy if exists "farm_update" on public.%I;', t);
    execute format('drop policy if exists "farm_delete" on public.%I;', t);
    execute format($p$ create policy "farm_select" on public.%I for select to authenticated
      using (user_id::text = public.farm_owner((select auth.uid()))::text); $p$, t);
    execute format($p$ create policy "farm_insert" on public.%I for insert to authenticated
      with check (user_id::text = public.farm_owner((select auth.uid()))::text); $p$, t);
    execute format($p$ create policy "farm_update" on public.%I for update to authenticated
      using (user_id::text = public.farm_owner((select auth.uid()))::text)
      with check (user_id::text = public.farm_owner((select auth.uid()))::text); $p$, t);
    execute format($p$ create policy "farm_delete" on public.%I for delete to authenticated
      using (user_id::text = public.farm_owner((select auth.uid()))::text); $p$, t);
    raise notice 'farm RLS → public.%', t;
  end loop;
end $$;

-- 4) user_settings — წევრი მხოლოდ კითხულობს (ფასი/ტარა/ოთახები), ვერ ცვლის ───
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='user_settings') then
    alter table public.user_settings enable row level security;
    drop policy if exists "own_rows_select" on public.user_settings;
    drop policy if exists "own_rows_insert" on public.user_settings;
    drop policy if exists "own_rows_update" on public.user_settings;
    drop policy if exists "own_rows_delete" on public.user_settings;
    drop policy if exists "us_farm_select" on public.user_settings;
    drop policy if exists "us_own_write_i" on public.user_settings;
    drop policy if exists "us_own_write_u" on public.user_settings;
    drop policy if exists "us_own_write_d" on public.user_settings;
    -- კითხვა: მფლობელი + მისი წევრები
    create policy "us_farm_select" on public.user_settings for select to authenticated
      using (user_id::text = public.farm_owner((select auth.uid()))::text);
    -- ჩაწერა/ცვლილება/წაშლა: მხოლოდ მფლობელი (თავისი user_id-ით)
    create policy "us_own_write_i" on public.user_settings for insert to authenticated
      with check (user_id = (select auth.uid()));
    create policy "us_own_write_u" on public.user_settings for update to authenticated
      using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
    create policy "us_own_write_d" on public.user_settings for delete to authenticated
      using (user_id = (select auth.uid()));
  end if;
end $$;

-- ============================================================================
--  შემდეგ: აპში — მფლობელი ქმნის ამწონველის ანგარიშს (email+პაროლი),
--  ამწონველი შედის თავისი ლოგინით და ხედავს მხოლოდ აწონვას.
-- ============================================================================
