"""
Backtest — bot.py-ის სტრატეგიის შემოწმება ისტორიულ მონაცემებზე.

ადარებს:
  A  — ახლანდელი სტრატეგია (SMA 10/30 15-წუთიანზე + stop-loss / take-profit)
  B  — A + გრძელვადიანი ფილტრი: ყიდულობს მხოლოდ თუ დღიური ფასი > 50-დღიან საშუალოზე
  BH — Buy & Hold: პერიოდის დასაწყისში $1000-ით ყიდვა და შენახვა

თითო სიმბოლოზე ერთდროულად მაქსიმუმ ერთი პოზიცია, $1000 თითო ყიდვაზე (როგორც bot.py-ში).
ხარჯები: აქციები 0.05% ერთ მხარეს (spread/slippage), კრიპტო 0.25% (Alpaca-ს საკომისიო).

გაშვება: python backtest.py [წლები, ნაგულისხმევი 2]
"""
import os
import sys
from datetime import datetime, timedelta, timezone

import pandas as pd

from alpaca.data.historical import StockHistoricalDataClient, CryptoHistoricalDataClient
from alpaca.data.requests import StockBarsRequest, CryptoBarsRequest
from alpaca.data.timeframe import TimeFrame, TimeFrameUnit

import bot  # იგივე პარამეტრები და Key-ები, რაც ბოტს აქვს

YEARS = float(sys.argv[1]) if len(sys.argv) > 1 else 2
TREND_DAYS = 50
COST = {False: 0.0005, True: 0.0025}  # is_crypto -> ერთი მხარის ხარჯი


def fetch(symbol, is_crypto, tf, start, end):
    if is_crypto:
        client = CryptoHistoricalDataClient(bot.API_KEY, bot.SECRET_KEY)
        df = client.get_crypto_bars(CryptoBarsRequest(
            symbol_or_symbols=symbol, timeframe=tf, start=start, end=end)).df
    else:
        client = StockHistoricalDataClient(bot.API_KEY, bot.SECRET_KEY)
        try:
            df = client.get_stock_bars(StockBarsRequest(
                symbol_or_symbols=symbol, timeframe=tf, start=start, end=end,
                feed="sip", adjustment="all")).df
        except Exception:
            df = client.get_stock_bars(StockBarsRequest(
                symbol_or_symbols=symbol, timeframe=tf, start=start, end=end,
                feed="iex", adjustment="all")).df
    df = df.xs(symbol, level="symbol") if isinstance(df.index, pd.MultiIndex) else df
    return df["close"].astype(float)


def simulate(closes, is_crypto, trend_ok=None):
    """closes: 15-წუთიანი ფასები. trend_ok: bool Series იგივე ინდექსით (ან None)."""
    fast = closes.rolling(bot.SMA_FAST).mean()
    slow = closes.rolling(bot.SMA_SLOW).mean()
    cost = COST[is_crypto]
    pnl, trades, wins = 0.0, 0, 0
    entry = None
    equity, peak, max_dd = 0.0, 0.0, 0.0

    for t, price in closes.items():
        f, s = fast[t], slow[t]
        if pd.isna(s):
            continue
        if entry is None:
            if f > s and (trend_ok is None or trend_ok[t]):
                entry = price * (1 + cost)
        else:
            change = (price / entry - 1) * 100
            if change <= -bot.STOP_LOSS_PCT or change >= bot.TAKE_PROFIT_PCT or f < s:
                exit_price = price * (1 - cost)
                profit = bot.DOLLARS_PER_TRADE * (exit_price / entry - 1)
                pnl += profit
                trades += 1
                wins += profit > 0
                entry = None
        open_pnl = bot.DOLLARS_PER_TRADE * (price / entry - 1) if entry else 0
        equity = pnl + open_pnl
        peak = max(peak, equity)
        max_dd = max(max_dd, peak - equity)

    if entry is not None:  # ბოლოს ღია პოზიციას ვხურავთ
        profit = bot.DOLLARS_PER_TRADE * (closes.iloc[-1] * (1 - cost) / entry - 1)
        pnl += profit
        trades += 1
        wins += profit > 0
    return {"pnl": pnl, "trades": trades,
            "win": (wins / trades * 100) if trades else 0, "dd": max_dd}


def main():
    end = datetime.now(timezone.utc) - timedelta(minutes=20)  # უფასო SIP მონაცემები 15 წთ დაგვიანებით
    start = end - timedelta(days=int(365 * YEARS))
    tf15 = TimeFrame(15, TimeFrameUnit.Minute)

    rows = []
    symbols = [(s, False) for s in bot.STOCKS] + [(s, True) for s in bot.CRYPTO]
    for symbol, is_crypto in symbols:
        try:
            closes = fetch(symbol, is_crypto, tf15, start, end)
            if not is_crypto:  # ბოტი აქციებს მხოლოდ ბირჟის საათებში ვაჭრობს
                et = closes.index.tz_convert("America/New_York")
                mins = et.hour * 60 + et.minute
                closes = closes[(mins >= 570) & (mins < 960) & (et.dayofweek < 5)]

            daily = fetch(symbol, is_crypto, TimeFrame.Day,
                          start - timedelta(days=TREND_DAYS * 2), end)
            # გუშინდელი დღის მონაცემით (ხვალინდელი არ ვიცით) — lookahead-ის გარეშე
            above = (daily > daily.rolling(TREND_DAYS).mean()).shift(1)
            above.index = above.index.normalize()
            day_key = closes.index.tz_convert("UTC").normalize()
            trend_ok = pd.Series(above.reindex(day_key, method="ffill").fillna(False).values,
                                 index=closes.index).astype(bool)

            a = simulate(closes, is_crypto)
            b = simulate(closes, is_crypto, trend_ok)
            bh = bot.DOLLARS_PER_TRADE * (closes.iloc[-1] * (1 - COST[is_crypto])
                                          / (closes.iloc[0] * (1 + COST[is_crypto])) - 1)
            rows.append((symbol, a, b, bh))
            print(f"{symbol}: OK ({len(closes)} ჩანაწერი)", flush=True)
        except Exception as e:
            print(f"{symbol}: შეცდომა — {e}", flush=True)

    def money(x):
        return f"{'+' if x >= 0 else '-'}${abs(x):,.0f}"

    lines = [
        f"## Backtest — ბოლო {YEARS:g} წელი ({start:%Y-%m-%d} → {end:%Y-%m-%d})",
        "",
        f"$ {bot.DOLLARS_PER_TRADE} თითო ყიდვაზე · SMA {bot.SMA_FAST}/{bot.SMA_SLOW} (15 წთ) · "
        f"SL -{bot.STOP_LOSS_PCT}% · TP +{bot.TAKE_PROFIT_PCT}% · ფილტრი: {TREND_DAYS}-დღიანი საშუალო",
        "",
        "| სიმბოლო | A: ახლანდელი | A გარიგებები / მოგებიანი | B: ფილტრით | B გარიგებები / მოგებიანი | Buy & Hold |",
        "|---|---|---|---|---|---|",
    ]
    tot = [0.0, 0.0, 0.0]
    for sym, a, b, bh in rows:
        lines.append(f"| {sym} | {money(a['pnl'])} | {a['trades']} / {a['win']:.0f}% | "
                     f"{money(b['pnl'])} | {b['trades']} / {b['win']:.0f}% | {money(bh)} |")
        tot[0] += a["pnl"]; tot[1] += b["pnl"]; tot[2] += bh
    lines.append(f"| **ჯამი** | **{money(tot[0])}** | | **{money(tot[1])}** | | **{money(tot[2])}** |")
    lines.append("")
    lines.append("მაქს. ჩავარდნა (max drawdown) ერთ სიმბოლოზე: " + ", ".join(
        f"{s} A {money(-a['dd'])} / B {money(-b['dd'])}" for s, a, b, _ in rows))

    report = "\n".join(lines)
    print("\n" + report)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write(report + "\n")


if __name__ == "__main__":
    main()
