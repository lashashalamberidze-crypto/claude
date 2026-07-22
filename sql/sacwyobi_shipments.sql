-- ============================================================================
--  AgroInTechSol — გამგზავრება/ექსპორტი (shipments) ცხრილი
--  გაუშვი Supabase → SQL Editor-ში ერთხელ.
--
--  ინახავს გატანის/ექსპორტის ჩანაწერებს: მისაბმელი, მძღოლი, მიმართულება,
--  პალეტები, ბრუტო/ნეტო წონა — sacwyobi.html-ის „🚚 გამგზავრება" ტაბისთვის.
--  user_id-ით სქოპირებული (თითო user მხოლოდ თავისას ხედავს კლიენტში).
-- ============================================================================

create table if not exists public.sacwyobi_shipments (
  id          text primary key,
  user_id     text not null,
  date        text,
  trailer     text,   -- მისაბმელი
  driver      text,   -- მძღოლი
  dest        text,   -- მიმართულება
  pallets     numeric,-- პალეტების რაოდენობა
  gross       numeric,-- ბრუტო კგ
  net         numeric,-- ნეტო კგ
  note        text,
  created_at  timestamptz default now()
);

create index if not exists sacwyobi_shipments_user_idx
  on public.sacwyobi_shipments (user_id);

-- ============================================================================
--  შემოწმება: select * from sacwyobi_shipments limit 5;
-- ============================================================================
