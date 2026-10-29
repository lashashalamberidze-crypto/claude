# AgroInTechSol — მოდულების დამაკავშირებელი კონტრაქტები

> ეს ფაილი ინახავს „ხელშეკრულებებს" მოდულებს შორის — რა ფორმატებია, ვინ რას ბეჭდავს/კითხულობს/წერს.
> **ცვლილების შეტანამდე წაიკითხე. ცვლილების შემდეგ განაახლე.**
> deploy-ში არ იტვირთება (`*.md` გამორიცხულია `deploy.yml`-ში).

## მოდულები (ფაილები)
| ფაილი | დანიშნულება |
|---|---|
| `index.html` | მთავარი აპი (dashboard, ზონირება, ძველი per-box სტიკერები) |
| `krefa.html` | **მკრეფავების მოდული** — მკრეფავი/გამომტანი, QR სტიკერები, ბრიგადირი, ანგარიში, რეგისტრაცია, შეტყობინებები |
| `awonva.html` | **აწონვა** — ყუთის სკანი + წონა → `harvest_sessions` |
| `shemowmeba.html` | **ყუთის/პალეტის შემოწმება** — სკანით შემოწმება, პალეტზე მიბმა, კოდის გასწორება |
| `sacwyobi.html` | საწყობი/სამაცივრე, გამგზავრება (shipments) |
| `inventari.html` | ინვენტარი |

## 🔑 კოდის ფორმატები (ყველა მოდულმა უნდა დაიცვას)

### ყუთის სტიკერი (QR)
```
uid|თარიღი|რიგი|კვარტალი|ყუთი#|shortCode
მაგ:  P1730…|2026-10-29|||001|AB7K9M
```
- **უნიკალურია თითო ყუთზე** (`shortCode` არ მეორდება).
- ბოლო სეგმენტი (`|`-ის მიხედვით) = `shortCode` — ეს იკითხება ყველგან (`lastSeg()`).
- პირველი სეგმენტი = მკრეფავის `uid` — აქედან ცნობენ მკრეფავს (`resolveByAny`).
- **ბეჭდავს:** `krefa.html → genBoxStickers()` (აგრეთვე `index.html → generateStickers()`).
- **კითხულობს/ინახავს:** `awonva.html` (აწონვისას → `harvest_sessions.code`=fullCode, `.short_code`=shortCode).
- **კითხულობს:** `shemowmeba.html` (`lastSeg`/`short_code`-ით).

### პალეტის კოდი (QR)
```
PAL001            ← krefa-ს ახალი ფორმატი (pref + ციფრები)
PAL-######-####   ← ძველი ფორმატი (ჯერ კიდევ ვალიდურია)
```
- **`palOk()` იღებს ორივეს:** `/^PAL-\d{6}-\d{4}$/i || /^[A-Z]{2,6}\d{1,6}$/i`.
- **ბეჭდავს:** `krefa.html → genPalletQr()` (`PAL`+ციფრები).
- **კითხულობს:** `awonva.html`, `shemowmeba.html`.

### რიგის კოდი (QR)
```
ROW:<row_id>
```
- **ბეჭდავს:** `krefa.html → genRowQr()`.
- **კითხულობს:** `awonva.html`, `shemowmeba.html` (აყენებს ზონა/რიგს).

### მკრეფავის QR / იდენტიფიკაცია
- მკრეფავის ბარათი QR = `uid`. `resolveByAny` პოულობს `uid`-ით ან `short_code`-ით.
- ახალ მკრეფავს: `short_code = uid` (default).

## ⚖️ აწონვის ლოგიკა (awonva.html)
- სკანი (სტიკერი `|`-ით) → ინახება **ზუსტად** დასკანერებული `shortCode`. `entry_mode='სკანი'`.
- უსტიკერო → `genCode()` ახალი კოდი, ჩანს დიდად, ამწონველი აწერს ყუთს. `entry_mode='ხელით'`.
- #️⃣ ნუმერაცია → `ნომერი-თარიღი-რიგი`.
- ⚠️ **აღარ არის** 📦 „პალეტით" ტაბი (წონას შემთხვევით არიგებდა — ამოღებულია).

## 📦 პალეტზე მიბმა (shemowmeba.html → „პალეტის გასწორება")
- ასკანერებ პალეტს (`palOk`) → ასკანერებ ყუთებს → `harvest_sessions.pallet_code`-ს სვამს `id`-ით.
- პალეტის სკანი → `loadPalletContents()` აჩვენებს ვისი/რამდენი კგ (რეალური წონით).

## 🗄️ ბაზის ცხრილები (ძირითადი ველები)
- `krepa_pickers`: `uid, user_id, num, name/firstName/lastName, phone, id(პ/ნ), address, bank, short_code, role('picker'|'carrier'), group_name, brigadier, brigadier_phone`
- `harvest_sessions`: `id, user_id, picker_id(uid), picker_name, phone, code, short_code, pallet_code, weight/kg, price, earned, date, time, row_num, quarter, entry_mode, source`
- `telegram_links`: `user_id, phone, chat_id, name` · `telegram_prefs`: `user_id, mode(off|daily|each)`
- `sms_log`: `+ channel('sms'|'telegram')`
- `attendance`: `id, user_id, picker_uid, picker_name, role, type(მოსვლა/წასვლა), date, time, ts`
- `sacwyobi_shipments`: `id, user_id, date, trailer, driver, dest, pallets, gross, net, note`

## 🚚 გამომტანის დღიური ხელფასი
- გლობალური ფიქსირებული დღიური თანხა: `user_settings` skey=`carrier_daily`.
- ცხრილი `krepa_carrier_pay` (`user_id, carrier_uid, date, amount`, PK სამივეზე) — `sql/carrier_pay.sql`.
- `krefa` რეგისტრაციაში: გამომტანის **მოსვლის** QR-სკანზე → ავტომ. ჩაიწერება იმ დღის `carrier_daily` (`attRecord` → `carrierPaySet`).
- ინდივ. კორექცია (ნახევარი დღე): ცხრილში ✏️ (`editCarrierPay`).
- ჩანს: რეგისტრაციის სტატ-ბარათი „💵 გამომტ. ხელფასი" + ცხრილის სვეტი.
- ⏳ TODO: ანგარიშის/Excel-ის ჯამებში ჩართვა.

## 🏭 მაცივარი — ზედხედი/ოთახები (sacwyobi.html, ეტაპი 1)
- ოთახების განლაგება (ზედხედი) ინახება: `user_settings` skey=`cold_rooms` (JSON: `[{no,x,y,w,h}]`, ბადე 12×8).
- ტაბი „🗺️ რუკა" — ოთახებს ხატავ ბადეზე (gეჭიროს+გაავლე), ნომრავ. `swRenderMap`/`SW_ROOMS`.
- ⏳ ეტაპი 2: პალეტის სკანი → ოთახი (კგ კრეფიდან); `swRoomKg(no)` დააბრუნებს ოთახის ჯამურ კგ-ს.
- ⏳ ეტაპი 3: გაყიდვა პალეტებით/ყუთებით/კგ → მყიდველი → ვალი (მოსაცემი).

## 📨 შეტყობინებები
- Telegram: `telegram-send` ფუნქცია → დაკავშირებულ მკრეფავს. ლოგი `sms_log` (`channel='telegram'`).
- SMS: `smsSend` (proxy). ტესტ-რეჟიმი: `window.__NOTIFY_OFF=true` → არავის არ მიდის.

## 👤 ბრიგადირი (საინფორმაციო)
- ბრიგადირი = **მხოლოდ საინფორმაციო** ველი მკრეფავზე (`brigadier`, `brigadier_phone`, `group_name`) — ცალკე ცხრილი/role არ არის.
- `krefa` დამატების ფორმაში ბრიგადირი აირჩევა **datalist-იდან** (არსებულები), ტელეფონი ავტო-ივსება (`BRIGPHONE` რუკა, `brigFillPhone()`) → ერთი ბრიგადირი ყოველთვის ერთნაირად იწერება.
- რეგისტრაციაში (`renderAttBrig`): „რომელი ბრიგადირის ჯგუფი მოვიდა" — მოსულები ბრიგადირის მიხედვით.
- ანგარიშებში/Excel-ში ბრიგადირი/ჯგუფი ჩანს მკრეფავთან.

---
_ბოლო განახლება: 2026-10-29 — awonva სკანის ფიქსი, უნიკალური ყუთის სტიკერი, პალეტის ფორმატი, ბრიგადირი (datalist + „ვინ მოვიდა"), ანგარიშის დეშბორდი სიმეტრიული, გამომტანის დღიური ხელფასი (ავტო მოსვლის სკანზე)._
