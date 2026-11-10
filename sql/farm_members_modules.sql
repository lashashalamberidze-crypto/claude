-- ============================================================================
--  AgroInTechSol — ფერმის წევრების გაფართოება: აგრონომი + შემმოწმებელი
--  ────────────────────────────────────────────────────────────────────────
--  farm_members.role:
--    'weigher'    → აწონვა (awonva.html)        — ცხრილები უკვე ჩართულია
--    'agronomist' → ფენოკალენდარი (phenocal.html) — phenocal_entries, plantations
--    'inspector'  → ბაღის/ყუთის შემოწმება (shemowmeba.html) — harvest_sessions (უკვე ჩართულია)
--
--  წინაპირობა: ჯერ გაშვებული გქონდეს sql/farm_members.sql (farm_owner() ფუნქცია).
--  გაუშვი Supabase → SQL Editor-ში ერთხელ.
-- ============================================================================

-- აგრონომის ცხრილები — წევრსაც მიუწვდება მფლობელის სტრიქონებზე (farm_owner-ით)
do $$
declare
  t text;
  mod_tables text[] := array['phenocal_entries','plantations'];
begin
  foreach t in array mod_tables loop
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

-- ============================================================================
--  შედეგი:
--   • მფლობელი თითო მოდულში ქმნის თავის წევრებს (აგრონომი / შემმოწმებელი),
--     ისინი შედიან საკუთარი email/პაროლით და ხედავენ მხოლოდ თავის მოდულს,
--     მონაცემები კი მფლობელის ფერმაში იწერება.
-- ============================================================================
