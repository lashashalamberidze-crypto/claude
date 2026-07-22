# gverdshi.ge — სახლის ოსტატების პლატფორმა

სტატიკური `index.html` + Supabase ბექენდი. (ცალკე პროექტია agrointechsol.ge-სგან,
ამიტომ საკუთარ საქაღალდეშია — root-ის `index.html`-ს არ ეხება.)

## ფაილები
| ფაილი | დანიშნულება |
|-------|-------------|
| `index.html` | მთელი საიტი (landing, ძებნა, კონტაქტი, შეფასება, waitlist, admin) |
| `sql/schema.sql` | Supabase-ის სრული სქემა: ცხრილები, RLS, რეიტინგის trigger, cron |

## ბექენდის გამართვა (Supabase)
1. SQL Editor → ჩასვი `sql/schema.sql` მთლიანად → Run. უსაფრთხოა არსებულ
   პროექტზეც (`IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS`).
2. `send-sms` edge function უნდა იყოს deploy-ული (SMS პროვაიდერით).
3. შემოწმება: `select jobname, schedule, active from cron.job;`

## რა გასწორდა კოდში (ამ ბრანჩში)
- **#1** პროფილის „შეფასების დატოვება" ღილაკი ახლა **ინახავს** ბაზაში
  (`reviews`, status=pending). ადრე მონაცემი იკარგებოდა.
- **#2** `reviews`-ის trigger ავტომატურად ითვლის `masters.rating` /
  `reviews_count`-ს დამტკიცებული შეფასებებიდან.
- **#3** `submitContact` ახლა **ერთ** `contacts` insert-ს აკეთებს (ადრე ორი
  სხვადასხვა სქემით — ერთ-ერთი ცდებოდა).
- **#4** cron (`dispatch_review_sms`, ყოველ 15 წთ) აგზავნის 3-დღიან
  შეფასების SMS-ს `send_review_at`-ის მიხედვით.
- **#7** კონტაქტი/waitlist ახლა `selectedCity`-ს იყენებს — აღარაა hardcoded `batumi`.

## ცოცხალ წვდომას საჭიროებს (ვერიფიკაცია)
- **SMS რეალურად გადის?** — `send-sms` function + პროვაიდერი.
- **cron დგას?** — `select * from cron.job;`.
- **#6 ძებნა სერვისით/უბნით** — ამჟამად `performHeroSearch` ფილტრს აგროვებს
  მაგრამ `loadMastersFromDB` მხოლოდ ქალაქით ფილტრავს. ფილტრის სწორად
  მისაბმელად საჭიროა DB-ში `category`/`areas` მნიშვნელობების ცოცხლად ნახვა.

## Deploy
სტატიკური ფაილია — `index.html` აიტვირთება gverdshi.ge-ის web root-ში
(cPanel/FTP). Supabase URL/anon key უკვე ჩაშენებულია.
