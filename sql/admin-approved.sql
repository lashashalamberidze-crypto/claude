-- ============================================
-- ადმინის „დადასტურებული ოსტატები" სექციისთვის
-- გაუშვი Supabase → SQL Editor-ში ერთხელ
-- ============================================

-- 1) approved_at სვეტი — ოსტატის დადასტურების თარიღი/დრო
alter table public.masters
  add column if not exists approved_at timestamptz;

-- 2) არსებული დადასტურებულებისთვის — თუ თარიღი ცარიელია,
--    დროებით ჩავსვათ რეგისტრაციის თარიღი (created_at)
update public.masters
  set approved_at = created_at
  where status = 'approved' and approved_at is null;

-- 3) წაშლის უფლება — მხოლოდ ადმინს (authenticated + სწორი email)
--    (RLS ჩართული უნდა იყოს masters ცხრილზე — უკვე არის)
drop policy if exists masters_admin_delete on public.masters;
create policy masters_admin_delete on public.masters
  for delete
  to authenticated
  using ( (auth.jwt() ->> 'email') = 'geodigiagro@gmail.com' );

-- 4) (თუ ჯერ არ არსებობს) — approved_at-ის განახლების უფლება ადმინს
--    (status-ის update უკვე მუშაობს, ესეც იმავე policy-ში ჯდება)
drop policy if exists masters_admin_update on public.masters;
create policy masters_admin_update on public.masters
  for update
  to authenticated
  using ( (auth.jwt() ->> 'email') = 'geodigiagro@gmail.com' )
  with check ( (auth.jwt() ->> 'email') = 'geodigiagro@gmail.com' );
