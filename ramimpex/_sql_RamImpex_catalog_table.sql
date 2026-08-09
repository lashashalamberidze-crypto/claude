-- RAM IMPEX — ფინანსური კატალოგი (მიმართულებები + პარამეტრები + ფასები)
-- ინახება ერთ სტრიქონად jsonb-ად. მხოლოდ ადმინი ხედავს/ცვლის (თვითღირებულება/მოგება — შიდა).
-- Supabase → SQL Editor → RUN

create table if not exists public.catalog (
  id         text primary key,
  dirs       jsonb,
  updated_at timestamptz not null default now()
);

alter table public.catalog enable row level security;

drop policy if exists "catalog_auth_all" on public.catalog;

-- წაკითხვა და ჩაწერა — მხოლოდ დალოგინებულ ადმინს (შიდა ფინანსური მონაცემები)
create policy "catalog_auth_all" on public.catalog
  for all to authenticated using (true) with check (true);
