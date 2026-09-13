-- ჯგუფი / ბრიგადირი (ხელმძღვანელი) მკრეფავებსა და გამომტანებზე
-- გაუშვი Supabase → SQL Editor-ში ერთხელ.
alter table public.krepa_pickers
  add column if not exists group_name      text,
  add column if not exists brigadier       text,
  add column if not exists brigadier_phone text;

-- ხშირი ფილტრისთვის (სურვილისამებრ)
create index if not exists krepa_pickers_group_idx
  on public.krepa_pickers (user_id, group_name);
