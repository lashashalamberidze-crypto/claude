-- ============================================================================
--  RAM IMPEX — ხარჯები (expenses) ცხრილი — პროდუქტზე მიბმული
--  გაუშვი Supabase Dashboard → SQL Editor-ში ერთხელ.
--
--   თითო ხარჯი: პროდუქტი (კოდი), კატეგორია, თანხა ₾, რაოდ., თარიღი, შენიშვნა,
--   + ზედნადების/ქვითრის დოკუმენტი (იმავე „sale-docs" bucket-ში).
--   დაშბორდი შემოსავალს (გადახდილი ინვოისებით) ადარებს ხარჯს პროდუქტზე.
-- ============================================================================

create table if not exists public.expenses (
  id          text primary key,
  date        date,
  code        text,          -- პროდუქტის კოდი ('' = ზოგადი)
  product     text,          -- პროდუქტის დასახელება (სნეპშოტი)
  category    text,          -- pack | transport | material | salary | tax | other
  amount      numeric,       -- თანხა ₾
  qty         numeric,       -- რაოდენობა (არჩ.)
  note        text,
  docs        jsonb default '{}'::jsonb,  -- {receipt: URL}
  created_at  timestamptz default now()
);

create index if not exists expenses_code_idx on public.expenses (code);
create index if not exists expenses_date_idx on public.expenses (date desc);

alter table public.expenses enable row level security;

drop policy if exists "expenses all authed" on public.expenses;
create policy "expenses all authed" on public.expenses
  for all to authenticated using (true) with check (true);

-- ============================================================================
--  შემოწმება: select code, category, amount from public.expenses order by date desc;
-- ============================================================================
