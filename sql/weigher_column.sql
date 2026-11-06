-- ============================================================================
--  AgroInTechSol — ამწონველის ტეგი harvest_sessions-ზე (ვინ აწონა)
--  გაუშვი Supabase → SQL Editor-ში ერთხელ.
--  თუ ჯერ არ გაგიშვია, აწონვა მაინც მუშაობს — კოდი ავტომატურად ტოვებს ამ ველს,
--  ოღონდ „ვინ აწონა" ინფორმაცია არ შეინახება სანამ სვეტი არ გაჩნდება.
-- ============================================================================

alter table public.harvest_sessions
  add column if not exists weigher text;

create index if not exists harvest_sessions_weigher
  on public.harvest_sessions (user_id, date, weigher);
