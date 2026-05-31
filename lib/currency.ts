import type { Currency, Subscription } from "./types";

// 通貨ごとの表示情報（フォーム選択肢にも使う）
export const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: "JPY", symbol: "¥", label: "円 (JPY)" },
  { code: "USD", symbol: "$", label: "ドル (USD)" },
  { code: "EUR", symbol: "€", label: "ユーロ (EUR)" },
];

const SYMBOL: Record<Currency, string> = { JPY: "¥", USD: "$", EUR: "€" };
// JPY は小数なし、USD/EUR は小数2桁で表示する
const FRACTION: Record<Currency, number> = { JPY: 0, USD: 2, EUR: 2 };

// 通貨未設定の既存データは JPY として扱う
export function getCurrency(sub: Pick<Subscription, "currency">): Currency {
  return sub.currency ?? "JPY";
}

// 通貨記号つきで整形する（¥1,480 / $9.99 / €9.99）
export function formatMoney(amount: number, currency: Currency = "JPY"): string {
  const digits = FRACTION[currency];
  return (
    SYMBOL[currency] +
    amount.toLocaleString("ja-JP", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  );
}

// 各通貨1単位が何円かを表すレート表（rates[X] = 1X が何円か）
export type Rates = Record<Currency, number>;

// API取得に失敗したとき／オフライン時に使う概算レート
export const FALLBACK_RATES: Rates = { JPY: 1, USD: 155, EUR: 168 };

// from通貨の金額を to通貨へ換算する（円を基準に経由）
export function convert(
  amount: number,
  from: Currency,
  to: Currency,
  rates: Rates,
): number {
  const jpy = amount * (rates[from] ?? 1);
  return jpy / (rates[to] ?? 1);
}
