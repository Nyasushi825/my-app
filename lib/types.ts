// サブスクの請求サイクル
export type BillingCycle = "monthly" | "yearly";

// 契約状態（解約済みは履歴として残す）。未設定は "active" 扱い
export type SubscriptionStatus = "active" | "cancelled";

// 1件のサブスク契約を表す型
export interface Subscription {
  id: string;
  name: string; // サービス名（例: Netflix）
  price: number; // 金額（円）
  cycle: BillingCycle; // 請求サイクル
  nextBillingDate: string; // 次回請求日 (YYYY-MM-DD)
  color: string; // アイコンに使う背景色（Tailwindのclassではなく16進）
  memo?: string; // メモ（任意）
  cancelUrl?: string; // 公式の解約手順ページURL（任意）
  status?: SubscriptionStatus; // 契約状態（未設定は active）
  cancelledAt?: number; // 解約日時（解約済みのみ）
  createdAt: number; // 作成日時（並び替え用）
}

// フォームから受け取る入力値（idやcreatedAt等は登録時に付与する）
export type SubscriptionInput = Omit<
  Subscription,
  "id" | "createdAt" | "status" | "cancelledAt"
>;

// status未設定を active とみなして判定する
export function isActive(sub: Subscription): boolean {
  return (sub.status ?? "active") === "active";
}
