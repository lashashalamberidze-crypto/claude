"""
მარტივი სავაჭრო ბოტი Alpaca-სთვის (Paper Trading).

სტრატეგია (SMA crossover + stop-loss / take-profit):
  - ყოველ გაშვებაზე იღებს ბოლო 15-წუთიან სანთლებს თითოეულ სიმბოლოზე.
  - მოკლე საშუალო (SMA_FAST) > გრძელ საშუალოზე (SMA_SLOW) და პოზიცია არ გვაქვს → ყიდულობს.
  - მოკლე < გრძელზე, ან ზარალი >= STOP_LOSS_PCT, ან მოგება >= TAKE_PROFIT_PCT → ყიდის.

ბოტი "stateless"-ია: ყოველი გაშვება ერთი შემოწმებაა. მუდმივად მუშაობისთვის
GitHub Actions უშვებს ყოველ 15 წუთში (.github/workflows/trading-bot.yml),
ან ლოკალურად: python bot.py --loop
"""
import os
import sys
import time
from datetime import datetime, timedelta, timezone

from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from alpaca.data.historical import StockHistoricalDataClient, CryptoHistoricalDataClient
from alpaca.data.requests import StockBarsRequest, CryptoBarsRequest
from alpaca.data.timeframe import TimeFrame, TimeFrameUnit

# ---- პარამეტრები (შეგიძლია შეცვალო) ----
STOCKS = ["AAPL", "MSFT", "NVDA", "SPY"]   # ვაჭრობს მხოლოდ ბირჟის საათებში
CRYPTO = []   # გამორთულია: backtest-ში საკომისიოს გამო ზარალიანი იყო (იყო "BTC/USD", "ETH/USD")
DOLLARS_PER_TRADE = 1000                   # ერთ ყიდვაზე რამდენი $
SMA_FAST = 10
SMA_SLOW = 30
STOP_LOSS_PCT = 3.0                        # -3% ზარალზე ყიდის
TAKE_PROFIT_PCT = 5.0                      # +5% მოგებაზე ყიდის
LOOP_MINUTES = 15

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


def sma(values, n):
    return sum(values[-n:]) / n


def get_closes(symbol, is_crypto, stock_data, crypto_data):
    start = datetime.now(timezone.utc) - timedelta(days=7)
    tf = TimeFrame(15, TimeFrameUnit.Minute)
    if is_crypto:
        bars = crypto_data.get_crypto_bars(
            CryptoBarsRequest(symbol_or_symbols=symbol, timeframe=tf, start=start))
    else:
        bars = stock_data.get_stock_bars(
            StockBarsRequest(symbol_or_symbols=symbol, timeframe=tf, start=start, feed="iex"))
    return [b.close for b in bars.data.get(symbol, [])]


def run_once():
    if not API_KEY or not SECRET_KEY:
        sys.exit("ALPACA_API_KEY / ALPACA_SECRET_KEY არ არის მითითებული.")

    trading = TradingClient(API_KEY, SECRET_KEY, paper=PAPER)
    stock_data = StockHistoricalDataClient(API_KEY, SECRET_KEY)
    crypto_data = CryptoHistoricalDataClient(API_KEY, SECRET_KEY)

    account = trading.get_account()
    log(f"{'PAPER' if PAPER else 'LIVE'} ანგარიში | ღირებულება: ${float(account.equity):,.2f} "
        f"| ნაღდი: ${float(account.cash):,.2f}")

    # პოზიციების სიმბოლოები Alpaca-ში კრიპტოზე "/"-ის გარეშეა (BTCUSD)
    positions = {p.symbol: p for p in trading.get_all_positions()}

    # კრიპტო სიიდან ამოღებულია — ძველი კრიპტო პოზიციები რომ არ დარჩეს უმართავი, ვხურავთ
    crypto_on = {c.replace("/", "") for c in CRYPTO}
    for sym, p in list(positions.items()):
        if "crypto" in str(p.asset_class).lower() and sym not in crypto_on:
            trading.close_position(sym)
            log(f"🔴 გაყიდვა {sym} — კრიპტო გამორთულია")
            del positions[sym]
    market_open = trading.get_clock().is_open

    symbols = [(s, True) for s in CRYPTO]
    if market_open:
        symbols += [(s, False) for s in STOCKS]
    else:
        log("აქციების ბირჟა დახურულია.")

    for symbol, is_crypto in symbols:
        try:
            closes = get_closes(symbol, is_crypto, stock_data, crypto_data)
            if len(closes) < SMA_SLOW:
                log(f"{symbol}: მონაცემები საკმარისი არ არის ({len(closes)})")
                continue

            fast, slow, price = sma(closes, SMA_FAST), sma(closes, SMA_SLOW), closes[-1]
            pos = positions.get(symbol.replace("/", ""))
            tif = TimeInForce.GTC if is_crypto else TimeInForce.DAY

            if pos is None:
                if fast > slow and float(account.cash) >= DOLLARS_PER_TRADE:
                    trading.submit_order(MarketOrderRequest(
                        symbol=symbol, notional=DOLLARS_PER_TRADE,
                        side=OrderSide.BUY, time_in_force=tif))
                    log(f"🟢 ყიდვა {symbol} ${DOLLARS_PER_TRADE} (ფასი {price:.2f})")
                else:
                    log(f"{symbol}: ლოდინი (fast {fast:.2f} / slow {slow:.2f})")
                continue

            pnl_pct = float(pos.unrealized_plpc) * 100
            reason = None
            if pnl_pct <= -STOP_LOSS_PCT:
                reason = f"stop-loss {pnl_pct:.2f}%"
            elif pnl_pct >= TAKE_PROFIT_PCT:
                reason = f"take-profit {pnl_pct:.2f}%"
            elif fast < slow:
                reason = f"ტრენდი შემობრუნდა ({pnl_pct:+.2f}%)"

            if reason:
                trading.close_position(pos.symbol)
                log(f"🔴 გაყიდვა {symbol} — {reason}")
            else:
                log(f"{symbol}: ვინახავ პოზიციას ({pnl_pct:+.2f}%)")
        except Exception as e:  # ერთი სიმბოლოს შეცდომამ დანარჩენი არ გააჩეროს
            log(f"⚠️ {symbol}: შეცდომა — {e}")


if __name__ == "__main__":
    if "--loop" in sys.argv:
        while True:
            run_once()
            time.sleep(LOOP_MINUTES * 60)
    else:
        run_once()
