-- ============================================================================
--  RAM IMPEX — მარაგი (stock) ცხრილი — პროდუქტზე ცალ-ცალკე
--  გაუშვი Supabase Dashboard → SQL Editor-ში ერთხელ.
--
--  რას აკეთებს:
--   1) ქმნის public.stock ცხრილს (თითო პროდუქტის კოდზე — დარჩენილი რაოდენობა).
--   2) რთავს RLS-ს და ამატებს policy-ს ავტორიზებული ადმინისთვის (როგორც invoices/sales).
--
--  ერთეული (კგ/ცალი) აპლიკაციაში განისაზღვრება პროდუქტის ტიპით — აქ მხოლოდ რიცხვია.
-- ============================================================================

create table if not exists public.stock (
  code        text primary key,   -- პროდუქტის კოდი
  qty         numeric default 0,   -- დარჩენილი რაოდენობა (კგ ან ცალი)
  updated_at  timestamptz default now()
);

alter table public.stock enable row level security;

drop policy if exists "stock all authed" on public.stock;
create policy "stock all authed" on public.stock
  for all to authenticated using (true) with check (true);

-- ============================================================================
--  შემოწმება: select code, qty from public.stock order by code;
-- ============================================================================
