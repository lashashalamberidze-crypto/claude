"""
სავაჭრო ბოტი Alpaca-სთვის — "დღეში ერთხელ" ტრენდის სტრატეგია (Paper Trading).

სტრატეგია (T 200 ზღვრით):
  - ფასი > 200-დღიანი საშუალო + BUFFER_PCT% და პოზიცია არ გვაქვს → ყიდულობს $DOLLARS_PER_TRADE-ით.
  - ფასი < 200-დღიანი საშუალო - BUFFER_PCT% და პოზიცია გვაქვს → ყიდის.
  ზღვარი იცავს ხშირი ყიდვა-გაყიდვისგან, როცა ფასი საშუალოს გარშემო "ცეკვავს".

ბოტი ვაჭრობს ბირჟის დახურვამდე ბოლო WINDOW_MINUTES წუთში (GitHub Actions უშვებს სამუშაო
დღეებში რამდენჯერმე, .github/workflows/trading-bot.yml — თუ ერთი დააგვიანდა, მეორე დაფარავს).
ეხება მხოლოდ STOCKS სიის აქციებს — ხელით ნაყიდ სხვა აქციებს არ ყიდის.

Telegram (არასავალდებულო): TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID → მესიჯი ყოველ ყიდვა/გაყიდვაზე,
შეცდომაზე და პარასკევს კვირის შეჯამება.
"""
import json
import os
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest, GetOrdersRequest
from alpaca.trading.enums import OrderSide, TimeInForce, QueryOrderStatus
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame

# ---- პარამეტრები (შეგიძლია შეცვალო) ----
STOCKS = ["AAPL", "MSFT", "NVDA", "SPY", "QQQ", "AMZN", "GOOGL", "META"]
DOLLARS_PER_TRADE = 1000      # თითო აქციაზე რამდენი $
TREND_DAYS = 200              # გრძელვადიანი საშუალო (დღეები)
BUFFER_PCT = 2.0              # ზღვარი საშუალოს ზემოთ/ქვემოთ (%)
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
TG_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
TG_CHAT = os.environ.get("TELEGRAM_CHAT_ID")

_messages = []  # ამ გაშვების მნიშვნელოვანი მოვლენები Telegram-ისთვის


def log(msg, notify=False):
    print(f"[{datetime.now(timezone.utc):%Y-%m-%d %H:%M UTC}] {msg}", flush=True)
    if notify:
        _messages.append(msg)


def telegram(text):
    if not (TG_TOKEN and TG_CHAT):
        return
    try:
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            data=json.dumps({"chat_id": TG_CHAT, "text": text}).encode(),
            headers={"Content-Type": "application/json"})
        urllib.request.urlopen(req, timeout=15)
    except Exception as e:  # Telegram-ის შეცდომამ ვაჭრობა არ უნდა გააჩეროს
        print(f"Telegram შეცდომა: {e}", flush=True)


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
    # ჯერ შეუსრულებელი ორდერები — რომ ერთი და იგივე ორჯერ არ ვიყიდოთ/გავყიდოთ
    pending = {o.symbol for o in trading.get_orders(GetOrdersRequest(status=QueryOrderStatus.OPEN))}

    start = datetime.now(timezone.utc) - timedelta(days=int(TREND_DAYS * 1.6))
    bars = data.get_stock_bars(StockBarsRequest(
        symbol_or_symbols=STOCKS, timeframe=TimeFrame.Day, start=start, feed="iex",
        adjustment="all")).data  # split-ებით დაკორექტირებული ფასები

    for symbol in STOCKS:
        try:
            if symbol in pending:
                log(f"{symbol}: ორდერი უკვე მიმდინარეობს — ვტოვებ")
                continue
            closes = [b.close for b in bars.get(symbol, [])]
            if len(closes) < TREND_DAYS:
                log(f"{symbol}: მონაცემები საკმარისი არ არის ({len(closes)})", notify=True)
                continue
            price = closes[-1]
            avg = sum(closes[-TREND_DAYS:]) / TREND_DAYS
            buy_above = avg * (1 + BUFFER_PCT / 100)
            sell_below = avg * (1 - BUFFER_PCT / 100)
            pos = positions.get(symbol)
            trend = f"ფასი {price:.2f} / {TREND_DAYS}-დღიანი {avg:.2f}"

            if pos is None and price > buy_above:
                if cash < DOLLARS_PER_TRADE:
                    log(f"{symbol}: ყიდვის სიგნალია, მაგრამ ნაღდი ფული არ კმარა", notify=True)
                    continue
                trading.submit_order(MarketOrderRequest(
                    symbol=symbol, notional=DOLLARS_PER_TRADE,
                    side=OrderSide.BUY, time_in_force=TimeInForce.DAY))
                cash -= DOLLARS_PER_TRADE
                log(f"🟢 ყიდვა {symbol} ${DOLLARS_PER_TRADE} ({trend})", notify=True)
            elif pos is not None and price < sell_below:
                trading.close_position(symbol)
                log(f"🔴 გაყიდვა {symbol} — ტრენდი დაეცა ({trend}, "
                    f"{float(pos.unrealized_pl):+,.2f}$ / {float(pos.unrealized_plpc) * 100:+.2f}%)",
                    notify=True)
            elif pos is not None:
                log(f"{symbol}: ვინახავ ({float(pos.unrealized_plpc) * 100:+.2f}%, {trend})")
            else:
                log(f"{symbol}: ლოდინი ({trend}, ყიდვა > {buy_above:.2f})")
        except Exception as e:  # ერთი სიმბოლოს შეცდომამ დანარჩენი არ გააჩეროს
            log(f"⚠️ {symbol}: შეცდომა — {e}", notify=True)

    # პარასკევს, ბოლო გაშვებისას — კვირის შეჯამება
    if clock.timestamp.weekday() == 4 and to_close <= 20:
        account = trading.get_account()
        equity, last = float(account.equity), float(account.last_equity)
        lines = [f"📊 კვირის შეჯამება ({'PAPER' if PAPER else 'LIVE'})",
                 f"ანგარიში: ${equity:,.2f} (დღეს {equity - last:+,.2f}$)",
                 f"ნაღდი: ${float(account.cash):,.2f}"]
        for p in trading.get_all_positions():
            if p.symbol in STOCKS:
                lines.append(f"• {p.symbol}: {float(p.unrealized_pl):+,.2f}$ "
                             f"({float(p.unrealized_plpc) * 100:+.2f}%)")
        _messages.append("\n".join(lines))


if __name__ == "__main__":
    try:
        run_once(force="--force" in sys.argv)
    except Exception as e:
        telegram(f"⚠️ სავაჭრო ბოტი: შეცდომა — {e}")
        raise
    if _messages:
        telegram("🤖 სავაჭრო ბოტი\n\n" + "\n".join(_messages))
