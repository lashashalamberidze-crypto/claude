-- ============================================================================
--  RAM IMPEX — ინვოისები = გაყიდვები (გაერთიანება)
--  გაუშვი Supabase Dashboard → SQL Editor-ში ერთხელ.
--
--  ამატებს invoices ცხრილს გადახდის/სტატუსის/დოკუმენტების სვეტებს, რომ ყოველი
--  ინვოისი იმავდროულად გაყიდვის ჩანაწერიც იყოს (დუბლირების გარეშე).
--  დოკუმენტების საცავად იყენებს იმავე „sale-docs" bucket-ს.
-- ============================================================================

alter table public.invoices add column if not exists paid   numeric default 0;
alter table public.invoices add column if not exists status text    default 'due';   -- paid | part | due
alter table public.invoices add column if not exists docs   jsonb   default '{}'::jsonb;

-- ---------- Storage bucket (თუ sales_table.sql არ გაგიშვია) ----------
insert into storage.buckets (id, name, public)
values ('sale-docs', 'sale-docs', true)
on conflict (id) do nothing;

drop policy if exists "sale-docs read"   on storage.objects;
drop policy if exists "sale-docs insert" on storage.objects;
drop policy if exists "sale-docs update" on storage.objects;
drop policy if exists "sale-docs delete" on storage.objects;

create policy "sale-docs read"   on storage.objects for select using (bucket_id = 'sale-docs');
create policy "sale-docs insert" on storage.objects for insert to authenticated with check (bucket_id = 'sale-docs');
create policy "sale-docs update" on storage.objects for update to authenticated using (bucket_id = 'sale-docs');
create policy "sale-docs delete" on storage.objects for delete to authenticated using (bucket_id = 'sale-docs');

-- ============================================================================
--  შემოწმება: select no, cust, grand, paid, status from public.invoices limit 5;
-- ============================================================================
