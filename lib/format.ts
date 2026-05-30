import type { Subscription } from "./types";

// 金額を「¥1,480」形式にフォーマットする
export function formatYen(amount: number): string {
  return "¥" + Math.round(amount).toLocaleString("ja-JP");
}

// 1件のサブスクを月額換算する（年額は12で割る）
export function toMonthly(sub: Pick<Subscription, "price" | "cycle">): number {
  return sub.cycle === "yearly" ? sub.price / 12 : sub.price;
}

// 月額合計を求める
export function totalMonthly(subs: Subscription[]): number {
  return subs.reduce((sum, s) => sum + toMonthly(s), 0);
}

// 年額合計を求める（月額換算 × 12）
export function totalYearly(subs: Subscription[]): number {
  return totalMonthly(subs) * 12;
}

// 請求サイクルの日本語ラベル
export function cycleLabel(cycle: Subscription["cycle"]): string {
  return cycle === "yearly" ? "年額" : "月額";
}

// 日付を「2026年6月15日」形式に整形する
export function formatDate(date: string): string {
  if (!date) return "未設定";
  const d = new Date(date + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "未設定";
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
