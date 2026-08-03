-- ═══════════════════════════════════════════════════════════════════
-- fix_krepa_price — კრეფის ფასის კორექცია სერვერზე, ერთი ბრძანებით
-- (თავიდან აიცილებს "statement timeout"-ს, რომელიც ასობით ცალკეული
--  განახლებისას ჩნდებოდა). გაუშვი Supabase → SQL Editor -ში ერთხელ.
--
-- აყენებს არჩეული პერიოდის ყველა ჩაწონვას ერთ ფასს და თანხას ხელახლა
-- ითვლის: earned = round(weight × price, 2). მუშაობს მხოლოდ შენს
-- მონაცემებზე (auth.uid()).
-- ═══════════════════════════════════════════════════════════════════
create or replace function public.fix_krepa_price(p_from text, p_to text, p_price numeric)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare n integer;
begin
  update public.harvest_sessions
     set price  = p_price,
         earned = round(coalesce(weight,0)::numeric * p_price, 2)
   where user_id = auth.uid()
     and date::text >= p_from
     and date::text <= p_to;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.fix_krepa_price(text,text,numeric) from public;
grant execute on function public.fix_krepa_price(text,text,numeric) to authenticated;
