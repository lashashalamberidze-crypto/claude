-- ============================================================================
--  AgroInTechSol — Row Level Security (RLS)
--  გაუშვი ეს Supabase Dashboard → SQL Editor-ში ერთხელ.
--
--  რას აკეთებს: თითოეულ ცხრილზე რთავს RLS-ს და ამატებს policy-ს, რომ
--  ავტორიზებულმა მომხმარებელმა მხოლოდ *თავისი* (user_id = auth.uid()) სტრიქონები
--  ნახოს/ჩაწეროს/შეცვალოს/წაშალოს. anon key-ით სხვისი მონაცემი ხელმიუწვდომელი ხდება.
--
--  აპის კოდი უცვლელი რჩება — ის ისედაც user_id-ით ფილტრავს, ასე რომ ქცევა იგივეა.
--
--  შენიშვნა: policy იყენებს user_id::text = auth.uid()::text — მუშაობს იმის
--  მიუხედავად, user_id სვეტი uuid ტიპისაა თუ text.
-- ============================================================================

do $$
declare
  t text;
  tables text[] := array[
    'harvest_sessions',
    'krepa_pickers',
    'sms_log',
    'user_settings',
    'agro_blocks',
    'agro_rows',
    'krepa_bonuses',
    'krepa_payroll'
  ];
begin
  foreach t in array tables loop
    -- გამოვტოვოთ ცხრილი თუ არ არსებობს (რომ სკრიპტმა ბოლომდე იმუშაოს)
    if not exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = t
    ) then
      raise notice 'ცხრილი public.% არ არსებობს — გამოტოვებულია', t;
      continue;
    end if;

    -- RLS ჩართვა
    execute format('alter table public.%I enable row level security;', t);

    -- ძველი policy-ს მოშორება (იდემპოტენტურობა — სკრიპტი მრავალჯერ გაშვებადია)
    execute format('drop policy if exists "own_rows_select" on public.%I;', t);
    execute format('drop policy if exists "own_rows_insert" on public.%I;', t);
    execute format('drop policy if exists "own_rows_update" on public.%I;', t);
    execute format('drop policy if exists "own_rows_delete" on public.%I;', t);

    -- SELECT: მხოლოდ საკუთარი
    execute format($p$
      create policy "own_rows_select" on public.%I
        for select to authenticated
        using ((select auth.uid())::text = user_id::text);
    $p$, t);

    -- INSERT: მხოლოდ საკუთარი user_id-ით
    execute format($p$
      create policy "own_rows_insert" on public.%I
        for insert to authenticated
        with check ((select auth.uid())::text = user_id::text);
    $p$, t);

    -- UPDATE: მხოლოდ საკუთარი
    execute format($p$
      create policy "own_rows_update" on public.%I
        for update to authenticated
        using ((select auth.uid())::text = user_id::text)
        with check ((select auth.uid())::text = user_id::text);
    $p$, t);

    -- DELETE: მხოლოდ საკუთარი
    execute format($p$
      create policy "own_rows_delete" on public.%I
        for delete to authenticated
        using ((select auth.uid())::text = user_id::text);
    $p$, t);

    raise notice 'RLS ჩართულია public.%-ზე', t;
  end loop;
end $$;

-- ============================================================================
--  შემოწმება — გაუშვი ცალკე რომ დაინახო რომელ ცხრილზეა RLS ჩართული:
--
--    select relname, relrowsecurity
--    from pg_class
--    where relname = any (array[
--      'harvest_sessions','krepa_pickers','sms_log','user_settings',
--      'agro_blocks','agro_rows','krepa_bonuses','krepa_payroll'
--    ]);
--
--  relrowsecurity = true ნიშნავს რომ RLS აქტიურია.
-- ============================================================================
