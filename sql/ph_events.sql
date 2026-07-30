-- ═══════════════════════════════════════════════════════════════════
-- ph_events — ღონისძიებათა კალენდარი (აგრო ბიბლიოთეკა → 📅 ღონისძიებები)
-- გაუშვი Supabase → SQL Editor -ში
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.ph_events (
  id           text primary key,
  user_id      uuid,
  title        text,
  type         text,
  event_date   text,          -- yyyy-mm-dd (დაწყება)
  date_to      text,          -- yyyy-mm-dd (დასრულება, არჩევითი)
  time         text,          -- HH:MM (არჩევითი)
  location     text,
  description  text,
  url          text,          -- რეგისტრაცია / შესვლის ბმული
  image        text,          -- base64 dataURL (არჩევითი)
  is_admin     boolean default false,
  created_at   text
);

alter table public.ph_events enable row level security;

-- წაკითხვა: ყველა ავტორიზებულ მომხმარებელს (საჯარო კალენდარია)
drop policy if exists ph_events_select on public.ph_events;
create policy ph_events_select on public.ph_events
  for select to authenticated using (true);

-- ჩაწერა/რედაქტ./წაშლა: მხოლოდ საკუთარ ჩანაწერებზე
drop policy if exists ph_events_insert on public.ph_events;
create policy ph_events_insert on public.ph_events
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists ph_events_update on public.ph_events;
create policy ph_events_update on public.ph_events
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists ph_events_delete on public.ph_events;
create policy ph_events_delete on public.ph_events
  for delete to authenticated using (user_id = auth.uid());
