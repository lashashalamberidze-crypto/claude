-- ✅ გაუშვი მხოლოდ ეს ფაილი Supabase → SQL Editor-ში (უსაფრთხო, გამეორებადი).
-- ამატებს ყველა ახალ სვეტს. policy-ებს არ ეხება, ამიტომ „already exists" შეცდომა აღარ იქნება.
-- თუ სვეტი უკვე არსებობს — ჩუმად გამოტოვებს.

-- 🛒 შესყიდვები (purchases): დოკუმენტები, დღგ, პარტია, ხარჯის დაშლა
alter table public.purchases add column if not exists docs  jsonb;
alter table public.purchases add column if not exists vat   boolean;
alter table public.purchases add column if not exists batch text;
alter table public.purchases add column if not exists parts jsonb;  -- {goods,transport,customs,vat,other}

-- 💸 ხარჯები (expenses): დღგ, პარტია
alter table public.expenses  add column if not exists vat   boolean;
alter table public.expenses  add column if not exists batch text;

-- დღგ: true = გადახდილი დღგ-ით, ჩაითვლება/დაბრუნდება · false = დღგ-ის გარეშე (ხელფასი, გადასახადი)
-- batch: პარტიის კოდი (მაგ. ANT-01) — თითო შესყიდვა = პარტია; ხარჯს შეიძლება მიება პარტია
