import type { Subscription } from "./types";
import { getCurrency, type Rates } from "./currency";

// 金額を「¥1,480」形式にフォーマットする（円固定のレガシー用途）
export function formatYen(amount: number): string {
  return "¥" + Math.round(amount).toLocaleString("ja-JP");
}

// 1件のサブスクを月額換算する（年額は12で割る／通貨は元のまま）
export function toMonthly(sub: Pick<Subscription, "price" | "cycle">): number {
  return sub.cycle === "yearly" ? sub.price / 12 : sub.price;
}

// 1件のサブスクの月額を「円」に換算する
export function monthlyInJPY(sub: Subscription, rates: Rates): number {
  return toMonthly(sub) * (rates[getCurrency(sub)] ?? 1);
}

// 月額合計（円換算）を求める
export function totalMonthlyJPY(subs: Subscription[], rates: Rates): number {
  return subs.reduce((sum, s) => sum + monthlyInJPY(s, rates), 0);
}

// 年額合計（円換算）を求める（月額換算 × 12）
export function totalYearlyJPY(subs: Subscription[], rates: Rates): number {
  return totalMonthlyJPY(subs, rates) * 12;
}

// 請求サイクルの日本語ラベル
export function cycleLabel(cycle: Subscription["cycle"]): string {
  return cycle === "yearly" ? "年額" : "月額";
}

// 一覧の並び替え方法
export type SortKey = "created" | "priceDesc" | "billingSoon";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "created", label: "登録順" },
  { value: "priceDesc", label: "月額が高い順" },
  { value: "billingSoon", label: "請求日が近い順" },
];

// 名前で絞り込み、指定キーで並び替えた新しい配列を返す（元配列は変更しない）
// priceDesc は通貨をまたぐため円換算で比較する
export function filterAndSort(
  subs: Subscription[],
  query: string,
  sort: SortKey,
  rates: Rates,
): Subscription[] {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? subs.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.memo ?? "").toLowerCase().includes(q),
      )
    : subs;

  const sorted = [...filtered];
  switch (sort) {
    case "priceDesc":
      sorted.sort((a, b) => monthlyInJPY(b, rates) - monthlyInJPY(a, rates));
      break;
    case "billingSoon":
      // 空の請求日は末尾へ
      sorted.sort((a, b) => {
        const da = a.nextBillingDate || "9999-99-99";
        const db = b.nextBillingDate || "9999-99-99";
        return da.localeCompare(db);
      });
      break;
    case "created":
    default:
      sorted.sort((a, b) => b.createdAt - a.createdAt);
      break;
  }
  return sorted;
}

// 日付を「2026年6月15日」形式に整形する
export function formatDate(date: string): string {
  if (!date) return "未設定";
  const d = new Date(date + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "未設定";
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
