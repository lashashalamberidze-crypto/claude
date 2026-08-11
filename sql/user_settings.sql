-- ═══════════════════════════════════════════════════════════════════
-- user_settings — მოწყობილობის/სასწოროს პარამეტრების ღრუბლის სინქრონი
-- (ფასი, ბაზა, ყუთის წონა, კალათა, std წონა, ტარა-PIN, SMS კონფიგი,
--  kg-ბონუსის საფეხურები, გამტანის ბონუსი, აწონვის რეჟიმი და ა.შ.)
--
-- ერთი სტრიქონი = ერთი პარამეტრი (skey → sval) ერთ მომხმარებელზე.
-- აპი ავტომატურად ტვირთავს (loadUserSettings) და ინახავს (pushUserSettings)
-- — ამ ცხრილის შექმნის შემდეგ პარამეტრები ყველა კომპიუტერზე ერთნაირი იქნება.
--
-- გაუშვი Supabase → SQL Editor -ში ერთხელ.
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.user_settings (
  user_id     uuid        not null,
  skey        text        not null,
  sval        text,
  updated_at  timestamptz default now(),
  primary key (user_id, skey)
);

alter table public.user_settings enable row level security;

-- მხოლოდ საკუთარ პარამეტრებზე წვდომა
drop policy if exists user_settings_select on public.user_settings;
create policy user_settings_select on public.user_settings
  for select to authenticated using (user_id = auth.uid());

drop policy if exists user_settings_insert on public.user_settings;
create policy user_settings_insert on public.user_settings
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists user_settings_update on public.user_settings;
create policy user_settings_update on public.user_settings
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists user_settings_delete on public.user_settings;
create policy user_settings_delete on public.user_settings
  for delete to authenticated using (user_id = auth.uid());

create index if not exists user_settings_user_idx
  on public.user_settings (user_id);
