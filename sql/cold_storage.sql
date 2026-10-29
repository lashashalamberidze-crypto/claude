-- ============================================================================
--  AgroInTechSol — მაცივრის ოთახების შიგთავსი + ტემპერატურა (matsivari.html)
--  გაუშვი Supabase → SQL Editor-ში ერთხელ.
-- ============================================================================

-- ოთახებში მოთავსებული პალეტები / ხელით ჩანაწერები
create table if not exists public.cold_stock (
  id         text primary key,
  user_id    uuid not null,
  room_no    text not null,
  kind       text not null default 'pallet',   -- 'pallet' (სკანი) | 'manual' (ხელით)
  pallet_code text,
  product    text,
  boxes      numeric default 0,
  kg         numeric default 0,
  note       text,
  date       text,
  created_at timestamptz default now()
);
alter table public.cold_stock enable row level security;
drop policy if exists cold_stock_all on public.cold_stock;
create policy cold_stock_all on public.cold_stock
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create index if not exists cold_stock_user_room on public.cold_stock (user_id, room_no);

-- ოთახების ტემპერატურის ჟურნალი (ხელით, პერიოდულად)
create table if not exists public.cold_temp (
  id       text primary key,
  user_id  uuid not null,
  room_no  text not null,
  temp     numeric,
  at       timestamptz default now()
);
alter table public.cold_temp enable row level security;
drop policy if exists cold_temp_all on public.cold_temp;
create policy cold_temp_all on public.cold_temp
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create index if not exists cold_temp_user_room on public.cold_temp (user_id, room_no);
