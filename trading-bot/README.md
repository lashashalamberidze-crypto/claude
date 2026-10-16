# სავაჭრო ბოტი (Alpaca Paper Trading)

ყოველ 15 წუთში ამოწმებს ფასებს და ავტომატურად ყიდულობს/ყიდის.
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
python bot.py --loop
```

## პარამეტრები (`bot.py` თავში)
`STOCKS`, `CRYPTO`, `DOLLARS_PER_TRADE`, `STOP_LOSS_PCT`, `TAKE_PROFIT_PCT`.
