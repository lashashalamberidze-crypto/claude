"""
სავაჭრო ბოტი Alpaca-სთვის — "დღეში ერთხელ" ტრენდის სტრატეგია (Paper Trading).

სტრატეგია (T 200):
  - ფასი > 200-დღიან საშუალოზე და პოზიცია არ გვაქვს → ყიდულობს $DOLLARS_PER_TRADE-ით.
  - ფასი < 200-დღიან საშუალოზე და პოზიცია გვაქვს → ყიდის.
5-წლიან backtest-ში (backtest.py) ეს იყო საუკეთესო "დღეში ერთხელ" სტრატეგია.

ბოტი ამოწმებს ბირჟის დახურვამდე ბოლო WINDOW_MINUTES წუთში (GitHub Actions უშვებს
სამუშაო დღეებში, .github/workflows/trading-bot.yml). სხვა დროს არაფერს აკეთებს,
თუ არ გაეშვა --force-ით.
"""
import os
import sys
from datetime import datetime, timedelta, timezone

from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame

# ---- პარამეტრები (შეგიძლია შეცვალო) ----
STOCKS = ["AAPL", "MSFT", "NVDA", "SPY", "QQQ", "AMZN", "GOOGL", "META"]
DOLLARS_PER_TRADE = 1000      # თითო აქციაზე რამდენი $
TREND_DAYS = 200              # გრძელვადიანი საშუალო (დღეები)
WINDOW_MINUTES = 45           # დახურვამდე რამდენ წუთში შეუძლია ვაჭრობა

# ლოკალურად გაშვებისას Key-ებს კითხულობს .env ფაილიდან (GitHub-ზე — Secrets-დან)
_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
if os.path.exists(_env):
    for line in open(_env, encoding="utf-8"):
        if "=" in line and not line.lstrip().startswith("#"):
            k, v = line.strip().split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

API_KEY = os.environ.get("ALPACA_API_KEY")
SECRET_KEY = os.environ.get("ALPACA_SECRET_KEY")
# უსაფრთხოება: ნაგულისხმევად მხოლოდ paper (ვირტუალური ფული)
PAPER = os.environ.get("ALPACA_PAPER", "true").lower() != "false"


def log(msg):
    print(f"[{datetime.now(timezone.utc):%Y-%m-%d %H:%M UTC}] {msg}", flush=True)


def run_once(force=False):
    if not API_KEY or not SECRET_KEY:
        sys.exit("ALPACA_API_KEY / ALPACA_SECRET_KEY არ არის მითითებული.")

    trading = TradingClient(API_KEY, SECRET_KEY, paper=PAPER)
    data = StockHistoricalDataClient(API_KEY, SECRET_KEY)

    clock = trading.get_clock()
    if not clock.is_open:
        log("ბირჟა დახურულია — არაფერს ვაკეთებ.")
        return
    to_close = (clock.next_close - clock.timestamp).total_seconds() / 60
    if to_close > WINDOW_MINUTES and not force:
        log(f"დახურვამდე {to_close:.0f} წთ — ჯერ ადრეა (ვამოწმებ ბოლო {WINDOW_MINUTES} წთ-ში).")
        return

    account = trading.get_account()
    cash = float(account.cash)
    log(f"{'PAPER' if PAPER else 'LIVE'} ანგარიში | ღირებულება: ${float(account.equity):,.2f} "
        f"| ნაღდი: ${cash:,.2f}")

    positions = {p.symbol: p for p in trading.get_all_positions()}

    # ძველი სტრატეგიის პოზიციები (კრიპტო ან სიაში არმყოფი) — ვხურავთ
    for sym, p in positions.items():
        if sym not in STOCKS:
            trading.close_position(sym)
            log(f"🔴 გაყიდვა {sym} — აღარ არის სიაში")

    start = datetime.now(timezone.utc) - timedelta(days=int(TREND_DAYS * 1.6))
    bars = data.get_stock_bars(StockBarsRequest(
        symbol_or_symbols=STOCKS, timeframe=TimeFrame.Day, start=start, feed="iex")).data

    for symbol in STOCKS:
        try:
            closes = [b.close for b in bars.get(symbol, [])]
            if len(closes) < TREND_DAYS:
                log(f"{symbol}: მონაცემები საკმარისი არ არის ({len(closes)})")
                continue
            price = closes[-1]
            avg = sum(closes[-TREND_DAYS:]) / TREND_DAYS
            pos = positions.get(symbol)
            trend = f"ფასი {price:.2f} / {TREND_DAYS}-დღიანი {avg:.2f}"

            if pos is None and price > avg:
                if cash < DOLLARS_PER_TRADE:
                    log(f"{symbol}: ნაღდი ფული არ კმარა")
                    continue
                trading.submit_order(MarketOrderRequest(
                    symbol=symbol, notional=DOLLARS_PER_TRADE,
                    side=OrderSide.BUY, time_in_force=TimeInForce.DAY))
                cash -= DOLLARS_PER_TRADE
                log(f"🟢 ყიდვა {symbol} ${DOLLARS_PER_TRADE} ({trend})")
            elif pos is not None and price < avg:
                trading.close_position(symbol)
                log(f"🔴 გაყიდვა {symbol} — ტრენდი დაეცა ({trend}, "
                    f"{float(pos.unrealized_plpc) * 100:+.2f}%)")
            elif pos is not None:
                log(f"{symbol}: ვინახავ ({float(pos.unrealized_plpc) * 100:+.2f}%, {trend})")
            else:
                log(f"{symbol}: ლოდინი — ტრენდი დაბლაა ({trend})")
        except Exception as e:  # ერთი სიმბოლოს შეცდომამ დანარჩენი არ გააჩეროს
            log(f"⚠️ {symbol}: შეცდომა — {e}")


if __name__ == "__main__":
    run_once(force="--force" in sys.argv)
