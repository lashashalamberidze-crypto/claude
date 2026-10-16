-- 💧 დღგ-ის ჩათვლის სვეტები (reclaimable input VAT flag)
-- გაუშვი Supabase → SQL Editor-ში ერთხელ.
-- true  = თანხა გადახდილია დღგ-ით და ის ჩაითვლება/დაბრუნდება (გამოაკლდება რეალურ ხარჯს)
-- false = დღგ-ის გარეშე (მაგ. ხელფასი, გადასახადი, არა-დღგ-ს გადამხდელი მომწოდებელი)
-- null  = ძველი ჩანაწერი → აპლიკაცია კატეგორიით წყვეტს (ნედლეული/ყიდვა, შეფუთვა,
--         ტრანსპორტი, საწვავი, ინვენტარი = დღგ-იანი; ხელფასი/გადასახადი/სხვა = არა)
alter table public.expenses  add column if not exists vat boolean;
alter table public.purchases add column if not exists vat boolean;
