-- ============================================================================
--  AgroInTechSol — Server-side aggregation RPC
--  გაუშვი Supabase Dashboard → SQL Editor-ში ერთხელ.
--
--  რას აკეთებს: ჯამებს ბაზაში ითვლის, რომ ბრაუზერმა 100k+ სტრიქონი აღარ ჩამოტვირთოს.
--  კლიენტი ჯერ ცდის ამ RPC-ს; თუ ფუნქცია ჯერ არ არსებობს — ძველ (loop) ლოგიკაზე
--  ბრუნდება. ასე რომ აპი მუშაობს ამ SQL-ის გაშვებამდეც და მის შემდეგაც.
--
--  security invoker (default) — RLS მაინც მოქმედებს, ფუნქცია მას არ გვერდს უვლის.
--  სემანტიკა ზუსტად ემთხვევა კლიენტის არსებულ დათვლას (იგივე ციფრები).
-- ============================================================================

-- ── 1) სეზონის ჯამი (awonva.html → fetchSeason) ──────────────────────────────
--    კლიენტის ეკვივალენტი:
--      kg      = Σ weight (null→0)
--      box     = count(*)
--      gel     = Σ earned (null→0)
--      pickers = distinct picker_name (არა-ცარიელი)
--      days    = distinct date (არა-null)
create or replace function public.season_totals()
returns table(kg numeric, box bigint, gel numeric, pickers bigint, days bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select
    coalesce(sum(weight), 0)::numeric                                             as kg,
    count(*)::bigint                                                              as box,
    coalesce(sum(earned), 0)::numeric                                            as gel,
    count(distinct picker_name) filter (where coalesce(picker_name,'') <> '')::bigint as pickers,
    count(distinct date)        filter (where date is not null)::bigint          as days
  from public.harvest_sessions
  where user_id::text = (select auth.uid())::text;
$$;

grant execute on function public.season_totals() to authenticated;


-- ── 2) მკრეფავების ლიდერბორდი (dafa.html → loadBoard) ────────────────────────
--    თითო მკრეფავზე ერთი სტრიქონი — კლიენტი აქედან ითვლის total/box/pcount/top10.
--    ჯგუფის გასაღები ზუსტად კლიენტისა: picker_id || ('n:'+picker_name).
--    p_date = NULL  → სულ;   p_date = 'YYYY-MM-DD' → მხოლოდ ის დღე.
create or replace function public.picker_leaderboard(p_date text default null)
returns table(k text, name text, kg numeric, box bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select
    coalesce(nullif(picker_id::text, ''), 'n:' || coalesce(picker_name, '')) as k,
    coalesce(min(picker_name), '—')                                          as name,
    coalesce(sum(weight), 0)::numeric                                        as kg,
    count(*)::bigint                                                         as box
  from public.harvest_sessions
  where user_id::text = (select auth.uid())::text
    and (p_date is null or date::text = p_date)
  group by coalesce(nullif(picker_id::text, ''), 'n:' || coalesce(picker_name, ''));
$$;

grant execute on function public.picker_leaderboard(text) to authenticated;

-- ============================================================================
--  ტესტი (SQL Editor-ში, შესული user-ის კონტექსტში):
--    select * from season_totals();
--    select * from picker_leaderboard(null)  order by kg desc limit 10;
--    select * from picker_leaderboard('2026-07-21') order by kg desc;
-- ============================================================================
