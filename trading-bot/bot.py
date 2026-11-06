"""
სავაჭრო ბოტი Alpaca-სთვის — "დღეში ერთხელ" ტრენდის სტრატეგია (Paper Trading).

სტრატეგია (T 200 ზღვრით):
  - ფასი > 200-დღიანი საშუალო + BUFFER_PCT% და პოზიცია არ გვაქვს → ყიდულობს $DOLLARS_PER_TRADE-ით.
  - ფასი < 200-დღიანი საშუალო - BUFFER_PCT% და პოზიცია გვაქვს → ყიდის.
  ზღვარი იცავს ხშირი ყიდვა-გაყიდვისგან, როცა ფასი საშუალოს გარშემო "ცეკვავს".

სიგნალი ითვლება ბოლო **დასრულებული** დღის დახურვის ფასით, ამიტომ ბოტს ნებისმიერ დროს
შეუძლია გაშვება (GitHub-ის schedule ხშირად საათობით აგვიანებს). ბირჟა თუ დახურულია,
ორდერი რიგში დგება და სრულდება შემდეგ გახსნაზე. დღეში რამდენჯერმე გაშვება უსაფრთხოა:
მიმდინარე ორდერის მქონე აქციას ტოვებს, ხოლო ნაყიდს ხელახლა არ ყიდულობს.
ეხება მხოლოდ STOCKS სიის აქციებს (და ყიდის RETIRED სიიდან დარჩენილებს) — ხელით ნაყიდ სხვა
აქციებს არ ყიდის.

Telegram (არასავალდებულო): TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID → მესიჯი ყოველ ყიდვა/გაყიდვაზე,
შეცდომაზე და შაბათს კვირის შეჯამება.
"""
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest, GetOrdersRequest
from alpaca.trading.enums import OrderSide, TimeInForce, QueryOrderStatus
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame

# ---- პარამეტრები (შეგიძლია შეცვალო) ----
# შერეული სია სხვადასხვა სექტორიდან (ტექნოლოგია, ჯანდაცვა, ენერგეტიკა, ბანკი, მომხმარებელი) —
# compare.py-ში ძველ "ტექნოლოგიურ" სიაზე 2.5-ჯერ ნაკლები ჩავარდნა ჰქონდა
STOCKS = ["AAPL", "MSFT", "AMZN", "JNJ", "XOM", "JPM", "KO", "WMT"]
# ძველი სიიდან ამოღებული — თუ ასეთი პოზიცია დარჩა, ბოტი ყიდის
RETIRED = ["NVDA", "SPY", "QQQ", "GOOGL", "META"]
DOLLARS_PER_TRADE = 1000      # თითო აქციაზე რამდენი $
TREND_DAYS = 200              # გრძელვადიანი საშუალო (დღეები)
BUFFER_PCT = 2.0              # ზღვარი საშუალოს ზემოთ/ქვემოთ (%)
# საწყისი თანხა — შეჯამებაში მთლიანი მოგება/ზარალი ამასთან შედარებით ითვლება.
# ნამდვილ ანგარიშზე გადასვლისას GitHub-ზე INITIAL_CAPITAL secret/variable-ით შეცვალე.
INITIAL_CAPITAL = float(os.environ.get("INITIAL_CAPITAL") or 100_000)
PROFIT_ALERT = 50             # ამაზე მეტ მოგებაზე შეჯამება გეტყვის, რომ შეგიძლია გაიტანო ($)

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

NY = ZoneInfo("America/New_York")
_messages = []  # ამ გაშვების მნიშვნელოვანი მოვლენები Telegram-ისთვის


def log(msg, notify=False):
    print(f"[{datetime.now(timezone.utc):%Y-%m-%d %H:%M UTC}] {msg}", flush=True)
    if notify:
        _messages.append(msg)


def telegram(text):
    """აგზავნის მესიჯს; აბრუნებს True-ს წარმატებისას."""
    if not (TG_TOKEN and TG_CHAT):
        return False
    try:
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            data=json.dumps({"chat_id": TG_CHAT, "text": text}).encode(),
            headers={"Content-Type": "application/json"})
        urllib.request.urlopen(req, timeout=15)
        return True
    except urllib.error.HTTPError as e:  # Telegram-ის შეცდომამ ვაჭრობა არ უნდა გააჩეროს
        print(f"Telegram შეცდომა: {e.code} {e.read().decode(errors='replace')}", flush=True)
    except Exception as e:
        print(f"Telegram შეცდომა: {e}", flush=True)
    return False


def profit_lines(account):
    """მთლიანი მოგება/ზარალი საწყის თანხასთან შედარებით + გატანის შეხსენება."""
    equity, cash = float(account.equity), float(account.cash)
    profit = equity - INITIAL_CAPITAL
    lines = [f"სულ: {profit:+,.2f}$ ({profit / INITIAL_CAPITAL * 100:+.2f}%) "
             f"საწყის ${INITIAL_CAPITAL:,.0f}-თან შედარებით"]
    if profit >= PROFIT_ALERT:
        lines += ["", f"💰 მოგებაში ხარ! გატანა შეგიძლია დაახლოებით ${min(profit, cash):,.2f}-ის "
                      "(ნაღდი ფულიდან — აქციების გაყიდვა არ სჭირდება)."]
        if PAPER:
            lines.append("ეს ვირტუალური ფულია — ნამდვილ ანგარიშზე ასეთ დროს გატანა "
                         "ბროკერის საიტზე ხელით ხდება.")
        else:
            lines.append("გატანა: ბროკერის საიტზე → Banking/Transfers → Withdraw. "
                         "გატანის შემდეგ INITIAL_CAPITAL შეამცირე იმავე თანხით.")
    elif profit < 0:
        lines.append("ჯერ ზარალშია — გატანა არ ღირს, ბოტი აგრძელებს.")
    return lines


def telegram_test():
    """სატესტო მესიჯი ანგარიშის მიმდინარე მდგომარეობით (ვაჭრობის გარეშე)."""
    if not (TG_TOKEN and TG_CHAT):
        sys.exit("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID secret-ები არ არის დამატებული GitHub-ზე.")
    trading = TradingClient(API_KEY, SECRET_KEY, paper=PAPER)
    account = trading.get_account()
    lines = ["✅ სავაჭრო ბოტი დაკავშირებულია Telegram-თან!", "",
             f"ანგარიში ({'PAPER' if PAPER else 'LIVE'}): ${float(account.equity):,.2f}",
             f"ნაღდი: ${float(account.cash):,.2f}"] + profit_lines(account) + [""]
    for p in trading.get_all_positions():
        lines.append(f"• {p.symbol}: {float(p.unrealized_pl):+,.2f}$ ({float(p.unrealized_plpc) * 100:+.2f}%)")
    lines += ["", "ამიერიდან მოგწერ ყიდვა/გაყიდვისას, შეცდომისას და შაბათს — კვირის შეჯამებას."]
    if not telegram("\n".join(lines)):
        sys.exit("Telegram-მა მესიჯი ვერ მიიღო — იხილე შეცდომა ზემოთ.")
    print("სატესტო მესიჯი გაიგზავნა ✅", flush=True)


def run_once():
    if not API_KEY or not SECRET_KEY:
        sys.exit("ALPACA_API_KEY / ALPACA_SECRET_KEY არ არის მითითებული.")

    trading = TradingClient(API_KEY, SECRET_KEY, paper=PAPER)
    data = StockHistoricalDataClient(API_KEY, SECRET_KEY)

    clock = trading.get_clock()
    now_ny = clock.timestamp.astimezone(NY)
    today_ny = now_ny.date()
    # დღევანდელი დღე დასრულებულად ითვლება მხოლოდ დახურვის (16:00 NY) შემდეგ
    today_done = not clock.is_open and (now_ny.hour, now_ny.minute) >= (16, 5)
    log(f"ბირჟა {'ღიაა' if clock.is_open else 'დახურულია — ორდერები შესრულდება შემდეგ გახსნაზე'}")

    account = trading.get_account()
    cash = float(account.cash)
    log(f"{'PAPER' if PAPER else 'LIVE'} ანგარიში | ღირებულება: ${float(account.equity):,.2f} "
        f"| ნაღდი: ${cash:,.2f}")

    positions = {p.symbol: p for p in trading.get_all_positions()}
    for p in positions.values():
        log(f"  • {p.symbol}: ${float(p.market_value):,.2f} ({float(p.unrealized_pl):+,.2f}$ / "
            f"{float(p.unrealized_plpc) * 100:+.2f}%)")
    # ჯერ შეუსრულებელი ორდერები — რომ ერთი და იგივე ორჯერ არ ვიყიდოთ/გავყიდოთ
    pending = {o.symbol for o in trading.get_orders(GetOrdersRequest(status=QueryOrderStatus.OPEN))}

    for symbol in RETIRED:
        if symbol in positions and symbol not in pending:
            try:
                pos = positions[symbol]
                trading.close_position(symbol)
                log(f"🔴 გაყიდვა {symbol} — სიიდან ამოღებულია ({float(pos.unrealized_pl):+,.2f}$ / "
                    f"{float(pos.unrealized_plpc) * 100:+.2f}%)", notify=True)
            except Exception as e:
                log(f"⚠️ {symbol}: შეცდომა — {e}", notify=True)

    start = datetime.now(timezone.utc) - timedelta(days=int(TREND_DAYS * 1.6))
    bars = data.get_stock_bars(StockBarsRequest(
        symbol_or_symbols=STOCKS, timeframe=TimeFrame.Day, start=start, feed="iex",
        adjustment="all")).data  # split-ებით დაკორექტირებული ფასები

    for symbol in STOCKS:
        try:
            if symbol in pending:
                log(f"{symbol}: ორდერი უკვე მიმდინარეობს — ვტოვებ")
                continue
            # მხოლოდ დასრულებული დღეები (დღევანდელი, ჯერ დაუსრულებელი დღე არ ითვლება)
            closes = [b.close for b in bars.get(symbol, [])
                      if today_done or b.timestamp.astimezone(NY).date() < today_ny]
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

    # შაბათს, დილის გაშვებისას — კვირის შეჯამება
    if now_ny.weekday() == 5 and clock.timestamp.hour < 16:
        account = trading.get_account()
        equity, last = float(account.equity), float(account.last_equity)
        lines = [f"📊 კვირის შეჯამება ({'PAPER' if PAPER else 'LIVE'})",
                 f"ანგარიში: ${equity:,.2f} (დღეს {equity - last:+,.2f}$)",
                 f"ნაღდი: ${float(account.cash):,.2f}"] + profit_lines(account) + [""]
        for p in trading.get_all_positions():
            if p.symbol in STOCKS:
                lines.append(f"• {p.symbol}: {float(p.unrealized_pl):+,.2f}$ "
                             f"({float(p.unrealized_plpc) * 100:+.2f}%)")
        _messages.append("\n".join(lines))


if __name__ == "__main__":
    if "--telegram-test" in sys.argv:
        telegram_test()
        sys.exit(0)
    try:
        run_once()
    except Exception as e:
        telegram(f"⚠️ სავაჭრო ბოტი: შეცდომა — {e}")
        raise
    if _messages:
        telegram("🤖 სავაჭრო ბოტი\n\n" + "\n".join(_messages))
