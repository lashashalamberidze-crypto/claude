"""
Backtest — "დღეში ერთხელ" სტრატეგიები (დღიური ფასები), ისტორიულ მონაცემებზე.

სტრატეგიები (სიგნალი დღის დახურვის ფასით, ყიდვა/გაყიდვა იმავე ფასით + ხარჯი):
  X 20/50  — ყიდულობს როცა 20-დღიანი საშუალო > 50-დღიანზე, ყიდის როცა ქვემოთ ჩამოვა
  X 50/200 — იგივე 50/200 დღეზე ("golden cross")
  T 200    — ინახავს სანამ ფასი > 200-დღიან საშუალოზე, ქვემოთ ჩამოსვლისას ყიდის
  T 200±B  — იგივე ზღვრით: ყიდულობს > საშუალო+B%, ყიდის < საშუალო-B% (bot.BUFFER_PCT)
  BH       — Buy & Hold

$1000 თითო სიმბოლოზე. ხარჯი: აქციები 0.05%, კრიპტო 0.25% ერთ მხარეს.
გაშვება: python backtest.py [წლები, ნაგულისხმევი 5] [--wide]
  --wide — ბოტის სიის ნაცვლად 20 სხვადასხვა დიდი კომპანია (მათ შორის წარუმატებლებიც),
           რომ შევამოწმოთ, სტრატეგია მხოლოდ "შერჩეულ გამარჯვებულებზე" ხომ არ მუშაობს.
"""
import os
import sys
from datetime import datetime, timedelta, timezone

import pandas as pd

from alpaca.data.historical import StockHistoricalDataClient, CryptoHistoricalDataClient
from alpaca.data.requests import StockBarsRequest, CryptoBarsRequest
from alpaca.data.timeframe import TimeFrame

import bot

ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
WIDE = "--wide" in sys.argv
YEARS = float(ARGS[0]) if ARGS else 5
WARMUP_DAYS = 320  # 200-დღიანი საშუალოსთვის საჭირო წინა ისტორია (კალენდარული დღეები)
WIDE_STOCKS = ["INTC", "BA", "DIS", "NKE", "PFE", "PYPL", "KO", "JNJ", "XOM", "WMT",
               "JPM", "V", "CSCO", "IBM", "VZ", "MMM", "CVS", "SBUX", "TSLA", "MRK"]
STOCKS = WIDE_STOCKS if WIDE else bot.STOCKS
# კრიპტო მხოლოდ შედარებისთვის — ბოტი კრიპტოთი არ ვაჭრობს
CRYPTO = [] if WIDE else ["BTC/USD", "ETH/USD"]
COST = {False: 0.0005, True: 0.0025}  # is_crypto -> ერთი მხარის ხარჯი


def fetch(symbol, is_crypto, tf, start, end):
    if is_crypto:
        df = CryptoHistoricalDataClient(bot.API_KEY, bot.SECRET_KEY).get_crypto_bars(
            CryptoBarsRequest(symbol_or_symbols=symbol, timeframe=tf, start=start, end=end)).df
    else:
        df = StockHistoricalDataClient(bot.API_KEY, bot.SECRET_KEY).get_stock_bars(
            StockBarsRequest(symbol_or_symbols=symbol, timeframe=tf, start=start, end=end,
                             feed="sip", adjustment="all")).df
    df = df.xs(symbol, level="symbol") if isinstance(df.index, pd.MultiIndex) else df
    return df["close"].astype(float)


def run(closes, start, is_crypto, fast=None, slow=None, trend=None, buffer=0.0):
    """აბრუნებს (მოგება $, გარიგებები, მოგებიანი %, max drawdown $, დრო ბაზარში %)."""
    cost = COST[is_crypto]
    if trend:
        avg = closes.rolling(trend).mean()
        buy_sig = closes > avg * (1 + buffer / 100)
        sell_sig = closes < avg * (1 - buffer / 100)
    else:
        diff = closes.rolling(fast).mean() > closes.rolling(slow).mean()
        buy_sig, sell_sig = diff, ~diff
    keep = closes.index >= start
    buy_sig, sell_sig, px = buy_sig[keep], sell_sig[keep], closes[keep]

    pnl, trades, wins, entry = 0.0, 0, 0, None
    peak, dd, days_in = 0.0, 0.0, 0
    for t, price in px.items():
        if entry is None and buy_sig[t]:
            entry = price * (1 + cost)
        elif entry is not None and sell_sig[t]:
            profit = bot.DOLLARS_PER_TRADE * (price * (1 - cost) / entry - 1)
            pnl += profit; trades += 1; wins += profit > 0; entry = None
        days_in += entry is not None
        eq = pnl + (bot.DOLLARS_PER_TRADE * (price / entry - 1) if entry else 0)
        peak = max(peak, eq); dd = max(dd, peak - eq)
    if entry is not None:
        profit = bot.DOLLARS_PER_TRADE * (px.iloc[-1] * (1 - cost) / entry - 1)
        pnl += profit; trades += 1; wins += profit > 0
    return pnl, trades, (wins / trades * 100 if trades else 0), dd, days_in / len(px) * 100


def buy_hold(closes, start, is_crypto):
    px = closes[closes.index >= start]
    c = COST[is_crypto]
    eq = bot.DOLLARS_PER_TRADE * (px * (1 - c) / (px.iloc[0] * (1 + c)) - 1)
    return eq.iloc[-1], (eq.cummax().clip(lower=0) - eq).max()


def main():
    end = datetime.now(timezone.utc) - timedelta(minutes=20)
    start = end - timedelta(days=int(365 * YEARS))
    strategies = [("X 20/50", dict(fast=20, slow=50)),
                  ("X 50/200", dict(fast=50, slow=200)),
                  ("T 200", dict(trend=200)),
                  (f"T 200±{bot.BUFFER_PCT:g}%", dict(trend=200, buffer=bot.BUFFER_PCT))]

    rows = []
    for sym, is_crypto in [(s, False) for s in STOCKS] + [(s, True) for s in CRYPTO]:
        try:
            closes = fetch(sym, is_crypto, TimeFrame.Day, start - timedelta(days=WARMUP_DAYS), end)
            res = [run(closes, start, is_crypto, **kw) for _, kw in strategies]
            rows.append((sym, res, buy_hold(closes, start, is_crypto)))
            print(f"{sym}: OK ({len(closes)} დღე)", flush=True)
        except Exception as e:
            print(f"{sym}: შეცდომა — {e}", flush=True)

    def m(x):
        return f"{'+' if x >= 0 else '-'}${abs(x):,.0f}"

    names = [n for n, _ in strategies]
    out = [f"## დღიური backtest{' (--wide: 20 სხვა კომპანია)' if WIDE else ''} — ბოლო {YEARS:g} წელი ({start:%Y-%m-%d} → {end:%Y-%m-%d})",
           "", f"${bot.DOLLARS_PER_TRADE} თითო სიმბოლოზე. უჯრაში: მოგება · გარიგებები · max ჩავარდნა", "",
           "| სიმბოლო | " + " | ".join(names) + " | Buy & Hold |",
           "|---" * (len(names) + 2) + "|"]
    tot = [0.0] * (len(names) + 1)
    tot_stock = [0.0] * (len(names) + 1)
    for sym, res, (bh, bh_dd) in rows:
        cells = [f"{m(p)} · {n} · {m(-d)}" for p, n, _, d, _ in res]
        out.append(f"| {sym} | " + " | ".join(cells) + f" | {m(bh)} · {m(-bh_dd)} |")
        vals = [r[0] for r in res] + [bh]
        tot = [a + b for a, b in zip(tot, vals)]
        if "/" not in sym:
            tot_stock = [a + b for a, b in zip(tot_stock, vals)]
    out.append("| **ჯამი (აქციები)** | " + " | ".join(f"**{m(x)}**" for x in tot_stock) + " |")
    out.append("| **ჯამი (ყველა)** | " + " | ".join(f"**{m(x)}**" for x in tot) + " |")
    out.append("")
    out.append("დრო ბაზარში (%): " + "; ".join(
        f"{s} " + "/".join(f"{r[4]:.0f}" for r in res) for s, res, _ in rows))

    report = "\n".join(out)
    print("\n" + report)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as f:
            f.write(report + "\n")


if __name__ == "__main__":
    main()
