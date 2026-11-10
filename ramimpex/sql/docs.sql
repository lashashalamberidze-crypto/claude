-- 🗂 დოკუმენტები — სხვადასხვა მიმართულების დოკუმენტების შენახვა + ფაილები
-- გაუშვი Supabase → SQL Editor-ში ერთხელ.
create table if not exists public.docs (
  id text primary key,
  title text,
  direction text,        -- მიმართულება (ჯგუფი/კატეგორია)
  kind text,             -- ტიპი (ხელშეკრულება / ინვოისი / სერტიფიკატი …)
  partner text,          -- პარტნიორი/მხარე
  status text,           -- მიმდინარე / დასრულებული / არქივი …
  date date,
  note text,
  files jsonb,           -- [{name,fname,url,type,size,date}]
  created_at timestamptz default now()
);
alter table public.docs enable row level security;
create policy "auth read docs"   on public.docs for select to authenticated using (true);
create policy "auth insert docs" on public.docs for insert to authenticated with check (true);
create policy "auth update docs" on public.docs for update to authenticated using (true);
create policy "auth delete docs" on public.docs for delete to authenticated using (true);

-- ფაილები ინახება არსებულ „sale-docs" bucket-ში (documents/ საქაღალდეში) — ახალი bucket არ სჭირდება.
