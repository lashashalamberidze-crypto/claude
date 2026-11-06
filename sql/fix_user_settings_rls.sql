-- ============================================================================
--  FIX — user_settings-ის ჩაწერის პოლისი (მფლობელს ფასი/ტარა რომ შეენახოს)
--  პრობლემა იყო: user_id = auth.uid() (uuid vs text) — ტიპი ვერ ედარებოდა.
--  გაუშვი Supabase → SQL Editor-ში ერთხელ.
-- ============================================================================
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='user_settings') then
    alter table public.user_settings enable row level security;
    drop policy if exists "us_farm_select" on public.user_settings;
    drop policy if exists "us_own_write_i" on public.user_settings;
    drop policy if exists "us_own_write_u" on public.user_settings;
    drop policy if exists "us_own_write_d" on public.user_settings;
    create policy "us_farm_select" on public.user_settings for select to authenticated
      using (user_id::text = public.farm_owner((select auth.uid()))::text);
    create policy "us_own_write_i" on public.user_settings for insert to authenticated
      with check (user_id::text = (select auth.uid())::text);
    create policy "us_own_write_u" on public.user_settings for update to authenticated
      using (user_id::text = (select auth.uid())::text) with check (user_id::text = (select auth.uid())::text);
    create policy "us_own_write_d" on public.user_settings for delete to authenticated
      using (user_id::text = (select auth.uid())::text);
  end if;
end $$;
