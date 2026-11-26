# 🤖 bank-analyze — Claude AI ანალიზი ბანკის შედარებაზე

საიტზე ღილაკი **„🤖 AI-მ გააანალიზოს (Claude)"** აგზავნის ბანკი↔პროგრამის შედარების
მონაცემებს ამ ფუნქციაში, ფუნქცია კი — Anthropic API-ს (Claude). გასაღები **სერვერზე** ინახება,
საიტის კოდში არ ჩანს.

## რა გჭირდება
1. **Anthropic API key** — https://console.anthropic.com → API Keys (`sk-ant-...`). ფასიანია (თითო ანალიზი ~1-3 ცენტი).
2. **Supabase CLI** — https://supabase.com/docs/guides/cli

## განთავსება (ერთხელ)
```bash
# პროექტის ფოლდერში (სადაც supabase/ არის)
supabase login
supabase link --project-ref mhyoqypzacvztwhntsvv

# გასაღების დაყენება (სერვერზე, დაშიფრულად)
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
# სურვილისამებრ მოდელი (ნაგულისხმევი: claude-sonnet-5-5)
supabase secrets set ANTHROPIC_MODEL=claude-sonnet-5-5

# ფუნქციის ატვირთვა
supabase functions deploy bank-analyze --no-verify-jwt
```

## მზადაა
საიტზე → ფინანსური ტრანზაქციები → 🏦 ბანკთან შედარება → ფაილ(ებ)ი ატვირთე →
🔍 შეადარე → **🤖 AI-მ გააანალიზოს**. Claude დააბრუნებს ანალიზს ქართულად.

## შენიშვნა უსაფრთხოებაზე
- გასაღები მხოლოდ Edge Function-შია (Supabase secrets). საიტის HTML-ში **არ** ჩანს.
- მონაცემი (შედარების შეჯამება) იგზავნება Anthropic-ში დასამუშავებლად.
- `--no-verify-jwt` — ფუნქციას ნებისმიერი იძახებს; თუ გინდა მხოლოდ შესული ადმინი,
  მოხსენი ეს დროშა და საიტი ისედაც ავტორიზებული `sb`-ით იძახებს.

## InTechSol-ისთვის იგივე
იგივე ფაილი დადე InTechSol-ის Supabase პროექტში, `link --project-ref <მათი-ref>`,
იგივე `secrets set`, `deploy`. კლიენტის მხარეს იგივე `sb.functions.invoke('bank-analyze', …)`.
