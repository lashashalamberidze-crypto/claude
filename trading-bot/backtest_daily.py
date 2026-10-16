"""
Backtest — "დღეში ერთხელ" სტრატეგიები (დღიური ფასები), ისტორიულ მონაცემებზე.

სტრატეგიები (სიგნალი დღის დახურვის ფასით, ყიდვა/გაყიდვა იმავე ფასით + ხარჯი):
  X 20/50  — ყიდულობს როცა 20-დღიანი საშუალო > 50-დღიანზე, ყიდის როცა ქვემოთ ჩამოვა
  X 50/200 — იგივე 50/200 დღეზე ("golden cross")
  T 200    — ინახავს სანამ ფასი > 200-დღიან საშუალოზე, ქვემოთ ჩამოსვლისას ყიდის
  BH       — Buy & Hold

$1000 თითო სიმბოლოზე. ხარჯი: აქციები 0.05%, კრიპტო 0.25% ერთ მხარეს.
გაშვება: python backtest_daily.py [წლები, ნაგულისხმევი 5]
"""
import os
import sys
from datetime import datetime, timedelta, timezone

from alpaca.data.timeframe import TimeFrame

import bot
from backtest import fetch, COST

YEARS = float(sys.argv[1]) if len(sys.argv) > 1 else 5
WARMUP_DAYS = 320  # 200-დღიანი საშუალოსთვის საჭირო წინა ისტორია (კალენდარული დღეები)
STOCKS = bot.STOCKS + ["QQQ", "AMZN", "GOOGL", "META"]
CRYPTO = ["BTC/USD", "ETH/USD"]


def run(closes, start, is_crypto, fast=None, slow=None, trend=None):
    """აბრუნებს (მოგება $, გარიგებები, მოგებიანი %, max drawdown $, დრო ბაზარში %)."""
    cost = COST[is_crypto]
    if trend:
        signal = closes > closes.rolling(trend).mean()
    else:
        signal = closes.rolling(fast).mean() > closes.rolling(slow).mean()
    signal, px = signal[closes.index >= start], closes[closes.index >= start]

    pnl, trades, wins, entry = 0.0, 0, 0, None
    peak, dd, days_in = 0.0, 0.0, 0
    for t, price in px.items():
        if entry is None and signal[t]:
            entry = price * (1 + cost)
        elif entry is not None and not signal[t]:
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
                  ("T 200", dict(trend=200))]

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
    out = [f"## დღიური backtest — ბოლო {YEARS:g} წელი ({start:%Y-%m-%d} → {end:%Y-%m-%d})",
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
