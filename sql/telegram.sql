-- ═══════════════════════════════════════════════════════════════════
-- Telegram — შეტყობინებები SMS-ის ნაცვლად (მკრეფავები / ამინდის მიმღებები)
-- Telegram-ს ნომრით ვერ მისწერ — თითო მიმღები ერთხელ „აკავშირებს" თავის
-- Telegram-ს (ბოტში Start → ნომრის გაზიარება). აქ ვინახავთ ტელ.↔chat_id.
-- გაუშვი Supabase → SQL Editor-ში ერთხელ.
-- ═══════════════════════════════════════════════════════════════════

-- ტელ. ↔ Telegram chat_id (თითო მფლობელ-ანგარიშზე)
create table if not exists public.telegram_links (
  user_id    uuid        not null,     -- ანგარიშის მფლობელი
  phone      text        not null,     -- ნორმალიზ. 995XXXXXXXXX
  chat_id    bigint      not null,     -- Telegram chat id
  name       text,
  linked_at  timestamptz default now(),
  primary key (user_id, phone)
);
create index if not exists telegram_links_chat_idx on public.telegram_links (chat_id);
alter table public.telegram_links enable row level security;
drop policy if exists tg_links_select on public.telegram_links;
create policy tg_links_select on public.telegram_links
  for select to authenticated using (user_id = auth.uid());
drop policy if exists tg_links_delete on public.telegram_links;
create policy tg_links_delete on public.telegram_links
  for delete to authenticated using (user_id = auth.uid());
-- ჩაწერას აკეთებს ბოტი (service role — RLS-ს არ ექვემდებარება)

-- დროებითი: chat_id → რომელი მფლობელის ბმულით შემოვიდა (Start-სა და კონტაქტს შორის)
create table if not exists public.telegram_pending (
  chat_id     bigint primary key,
  owner_token text,
  at          timestamptz default now()
);
alter table public.telegram_pending enable row level security;  -- მხოლოდ service role წვდება

-- შეტყობინების რეჟიმი თითო მფლობელზე
create table if not exists public.telegram_prefs (
  user_id    uuid primary key,
  mode       text default 'daily',   -- 'daily' (დღის ჯამი — პრიორიტეტი) | 'each' (თითო აწონვა) | 'off'
  updated_at timestamptz default now()
);
alter table public.telegram_prefs enable row level security;
drop policy if exists tg_prefs_all on public.telegram_prefs;
create policy tg_prefs_all on public.telegram_prefs
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
