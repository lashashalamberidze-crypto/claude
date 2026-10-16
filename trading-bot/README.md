# სავაჭრო ბოტი (Alpaca Paper Trading)

დღეში ერთხელ (დახურვამდე ბოლო 45 წთ-ში) ამოწმებს 8 აქციას: ფასი > 200-დღიანი საშუალო +2% → ყიდულობს, < საშუალო -2% → ყიდის. Telegram: secrets `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`. Backtest: `python backtest.py`.
ნაგულისხმევად მუშაობს **მხოლოდ ვირტუალურ ფულზე** (`ALPACA_PAPER=true`).

## გაშვება GitHub-ზე (24/7, კომპიუტერის გარეშე)
1. GitHub → რეპო → **Settings → Secrets and variables → Actions → New repository secret**
   - `ALPACA_API_KEY`, `ALPACA_SECRET_KEY`
2. ეს ფაილები უნდა იყოს `main` ბრანჩში (schedule მხოლოდ main-იდან მუშაობს).
3. **Actions → Trading bot → Run workflow** — პირველი ხელით გაშვება. ლოგში ჩანს რა იყიდა/გაყიდა.

## ლოკალურად
```
pip install -r requirements.txt
copy .env.example .env      # ჩაწერე Key-ები
python bot.py --force
```

## პარამეტრები (`bot.py` თავში)
`STOCKS`, `DOLLARS_PER_TRADE`, `TREND_DAYS`, `BUFFER_PCT`.
