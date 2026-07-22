# 💳 BOG (საქართველოს ბანკი) გადახდის ინტეგრაცია — Setup

> ⚠️ **სტატუსი: scaffold (ცოცხლად არ არის დატესტილი).** ეს კოდი BOG-ის Payments API-ის
> დოკუმენტაციის მიხედვითაა დაწერილი, მაგრამ საჭიროებს შენს გასაღებებს და **BOG-ის
> ტესტ-გარემოში გატესტვას** deploy-მდე. ცოცხალ საიტზე გადახდის ღილაკი ჯერ **არ ჩართულა**.

## რა გჭირდება BOG-ისგან
1. ბიზნეს-ბანკინგში გააქტიურე **E-commerce (ონლაინ გადახდები)**.
2. მიიღებ: **client_id** და **client_secret**.

## Deploy (Supabase CLI)
```bash
# 1. secrets
supabase secrets set BOG_CLIENT_ID=xxxx BOG_CLIENT_SECRET=xxxx PUBLIC_SITE_URL=https://gverdshi.ge
# (SUPABASE_URL და SUPABASE_SERVICE_ROLE_KEY ავტომატურად ხელმისაწვდომია functions-ში)

# 2. ფუნქციები
supabase functions deploy bog-create-order --no-verify-jwt
supabase functions deploy bog-callback     --no-verify-jwt
```

## ცხრილი
`payments` ცხრილი დაამატე `sql/schema.sql`-იდან (ის უკვე შეიცავს მას).

## Frontend — გადახდის ღილაკის ჩართვა (ტესტის შემდეგ)
როცა ფუნქციები BOG-ის ტესტში იმუშავებს, index.html-ში დაამატე ეს helper და
გამოიძახე ჯავშნიდან (მაგ. „გადაიხადე ბე"):
```js
async function gvPay(amount, description, bookingId, phone){
  const r = await fetch(SUPABASE_URL + '/functions/v1/bog-create-order', {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+SUPABASE_KEY, 'apikey':SUPABASE_KEY },
    body: JSON.stringify({ amount, description, booking_id: bookingId, customer_phone: phone })
  });
  const d = await r.json();
  if (d.redirect) window.location.href = d.redirect;   // BOG-ის გადახდის გვერდზე
  else alert('გადახდის შექმნა ვერ მოხერხდა');
}
```

## 🔐 პროდაქშენამდე აუცილებელი
- **Callback ხელმოწერის ვერიფიკაცია** BOG-ის public key-ით (`bog-callback/index.ts`-ში მონიშნულია TODO).
- ველების სახელების გადამოწმება BOG-ის აქტუალურ დოკუმენტაციასთან (`total_amount`,
  `order_status.key`, `_links.redirect.href` და ა.შ.).
- ტესტ-ბარათებით სრული ფლოუს გატესტვა BOG-ის sandbox-ში.
