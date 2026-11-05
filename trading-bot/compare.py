"""
სიების შედარება — რომელი აქციების სია ჯობია ბოტისთვის (მთლიანი პორტფელის დონეზე).

თითო სიაზე, $1000 თითო სიმბოლოზე, ითვლის ბოტის სტრატეგიას (T 200 ±BUFFER_PCT%) და Buy & Hold-ს:
  - მოგება $ და % ჩადებულ თანხაზე
  - პორტფელის მაქს. ჩავარდნა (ყველაზე დიდი ვარდნა პიკიდან, ყველა სიმბოლო ერთად)
  - შედეგი წლების მიხედვით

გაშვება: python compare.py [წლები, ნაგულისხმევი 5]
"""
import os
import sys
from datetime import datetime, timedelta, timezone

import pandas as pd
from alpaca.data.timeframe import TimeFrame

import bot
from backtest import fetch, COST, WARMUP_DAYS

YEARS = float(sys.argv[1]) if len(sys.argv) > 1 else 5
LISTS = {
    "ახლანდელი 8 (ძირითადად ტექნოლოგიები)": bot.STOCKS,
    "სექტორების ETF-ები": ["SPY", "XLK", "XLV", "XLF", "XLE", "XLP", "XLI", "XLY", "XLU"],
    "შერეული აქციები": ["AAPL", "MSFT", "AMZN", "JNJ", "XOM", "JPM", "KO", "WMT"],
}


def equity_trend(closes, start, trend=bot.TREND_DAYS, buffer=bot.BUFFER_PCT):
    """ბოტის სტრატეგიის მოგება/ზარალი $ ყოველ დღეს (რეალიზებული + ღია პოზიცია)."""
    cost = COST[False]
    avg = closes.rolling(trend).mean()
    buy_sig, sell_sig = closes > avg * (1 + buffer / 100), closes < avg * (1 - buffer / 100)
    px = closes[closes.index >= start]
    pnl, entry, curve = 0.0, None, []
    for t, price in px.items():
        if entry is None and buy_sig[t]:
            entry = price * (1 + cost)
        elif entry is not None and sell_sig[t]:
            pnl += bot.DOLLARS_PER_TRADE * (price * (1 - cost) / entry - 1)
            entry = None
        curve.append(pnl + (bot.DOLLARS_PER_TRADE * (price / entry - 1) if entry else 0))
    return pd.Series(curve, index=px.index.normalize())


def equity_hold(closes, start):
    px = closes[closes.index >= start]
    c = COST[False]
    eq = bot.DOLLARS_PER_TRADE * (px * (1 - c) / (px.iloc[0] * (1 + c)) - 1)
    eq.index = px.index.normalize()
    return eq


def stats(curve, capital):
    dd = (curve.cummax().clip(lower=0) - curve).max()
    yearly = curve.groupby(curve.index.year).last().diff()
    yearly.iloc[0] = curve.groupby(curve.index.year).last().iloc[0]
    return curve.iloc[-1], curve.iloc[-1] / capital * 100, dd, dd / capital * 100, yearly


def main():
    end = datetime.now(timezone.utc) - timedelta(minutes=20)
    start = end - timedelta(days=int(365 * YEARS))

    def m(x):
        return f"{'+' if x >= 0 else '-'}${abs(x):,.0f}"

    out = [f"## სიების შედარება — ბოლო {YEARS:g} წელი ({start:%Y-%m-%d} → {end:%Y-%m-%d})", "",
           f"${bot.DOLLARS_PER_TRADE} თითო სიმბოლოზე. ბოტი = T {bot.TREND_DAYS} ±{bot.BUFFER_PCT:g}%.", "",
           "| სია | ჩადებული | ბოტი: მოგება | ბოტი: მაქს. ჩავარდნა | Buy & Hold: მოგება | B&H: მაქს. ჩავარდნა |",
           "|---|---|---|---|---|---|"]
    years_rows = []
    for name, symbols in LISTS.items():
        bot_curves, hold_curves = [], []
        for sym in symbols:
            try:
                closes = fetch(sym, False, TimeFrame.Day, start - timedelta(days=WARMUP_DAYS), end)
                bot_curves.append(equity_trend(closes, start))
                hold_curves.append(equity_hold(closes, start))
                print(f"{name} / {sym}: OK", flush=True)
            except Exception as e:
                print(f"{name} / {sym}: შეცდომა — {e}", flush=True)
        if not bot_curves:
            continue
        capital = bot.DOLLARS_PER_TRADE * len(bot_curves)
        b = stats(pd.concat(bot_curves, axis=1).ffill().fillna(0).sum(axis=1), capital)
        h = stats(pd.concat(hold_curves, axis=1).ffill().fillna(0).sum(axis=1), capital)
        out.append(f"| {name} | ${capital:,} | {m(b[0])} ({b[1]:+.0f}%) | {m(-b[2])} (-{b[3]:.0f}%) | "
                   f"{m(h[0])} ({h[1]:+.0f}%) | {m(-h[2])} (-{h[3]:.0f}%) |")
        years_rows.append((name, capital, b[4], h[4]))

    out += ["", "### წლების მიხედვით (% ჩადებულ თანხაზე): ბოტი / Buy & Hold", ""]
    all_years = sorted({y for _, _, by, _ in years_rows for y in by.index})
    out.append("| სია | " + " | ".join(str(y) for y in all_years) + " |")
    out.append("|---" * (len(all_years) + 1) + "|")
    for name, capital, by, hy in years_rows:
        cells = [f"{by.get(y, 0) / capital * 100:+.0f}% / {hy.get(y, 0) / capital * 100:+.0f}%"
                 for y in all_years]
        out.append(f"| {name} | " + " | ".join(cells) + " |")

    report = "\n".join(out)
    print("\n" + report)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as f:
            f.write(report + "\n")


if __name__ == "__main__":
    main()
