-- ═══════════════════════════════════════════════════════════════════
-- agro_season_archive — სეზონის დახურვა / არქივი (📦 arqivi.html)
-- ერთი ჩანაწერი = ერთი დახურული სეზონის სრული სნეპშოტი (payload jsonb)
-- გაუშვი Supabase → SQL Editor -ში ერთხელ.
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.agro_season_archive (
  id           text primary key,
  user_id      uuid,
  season_name  text,
  archived_at  timestamptz default now(),
  summary      jsonb,        -- { table: count, ... , _totals:{...} }
  payload      jsonb,        -- { table: [rows...], ... } — სრული სნეპშოტი
  cleared      jsonb,        -- რომელი ცხრილები გასუფთავდა ცოცხალი ბაზიდან
  created_at   timestamptz default now()
);

alter table public.agro_season_archive enable row level security;

-- მხოლოდ საკუთარ არქივებზე წვდომა
drop policy if exists season_archive_select on public.agro_season_archive;
create policy season_archive_select on public.agro_season_archive
  for select to authenticated using (user_id = auth.uid());

drop policy if exists season_archive_insert on public.agro_season_archive;
create policy season_archive_insert on public.agro_season_archive
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists season_archive_update on public.agro_season_archive;
create policy season_archive_update on public.agro_season_archive
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists season_archive_delete on public.agro_season_archive;
create policy season_archive_delete on public.agro_season_archive
  for delete to authenticated using (user_id = auth.uid());

create index if not exists agro_season_archive_user_idx
  on public.agro_season_archive (user_id, archived_at desc);
