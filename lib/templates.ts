import type { SubscriptionInput } from "./types";

// よく使われるサブスクのテンプレート（ワンタップ登録用の最小セット）
// 本家「サブスクBox」は280件超だが、まずは代表的なものだけ用意する
export interface Template {
  name: string;
  price: number;
  cycle: SubscriptionInput["cycle"];
  color: string;
}

export const TEMPLATES: Template[] = [
  { name: "Netflix スタンダード", price: 1590, cycle: "monthly", color: "#e50914" },
  { name: "Spotify Premium", price: 980, cycle: "monthly", color: "#1db954" },
  { name: "Amazon Prime", price: 600, cycle: "monthly", color: "#ff9900" },
  { name: "YouTube Premium", price: 1280, cycle: "monthly", color: "#ff0000" },
  { name: "Apple Music", price: 1080, cycle: "monthly", color: "#fa243c" },
  { name: "Disney+", price: 990, cycle: "monthly", color: "#113ccf" },
  { name: "ChatGPT Plus", price: 3000, cycle: "monthly", color: "#10a37f" },
  { name: "Adobe CC", price: 7780, cycle: "monthly", color: "#fa0f00" },
];
