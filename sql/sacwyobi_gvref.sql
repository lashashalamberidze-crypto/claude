-- ============================================================================
--  AgroInTechSol — sacwyobi_ops: gv_ref სვეტი (გაყიდვა/შესყიდვის ანალიტიკის კავშირი)
--  გაუშვი Supabase → SQL Editor-ში ერთხელ.
--
--  ინახავს კავშირს sacwyobi_ops ↔ gv_sales/gv_purchases ჩანაწერს შორის, რომ
--  გადახდის კორექტირება გვერდის გადატვირთვის შემდეგაც სწორად აისახოს ანალიტიკაში.
-- ============================================================================

alter table public.sacwyobi_ops
  add column if not exists gv_ref text;

-- შემოწმება: select id, gv_ref from sacwyobi_ops limit 5;
