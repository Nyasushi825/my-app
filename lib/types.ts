// サブスクの請求サイクル
export type BillingCycle = "monthly" | "yearly";

// 1件のサブスク契約を表す型
export interface Subscription {
  id: string;
  name: string; // サービス名（例: Netflix）
  price: number; // 金額（円）
  cycle: BillingCycle; // 請求サイクル
  nextBillingDate: string; // 次回請求日 (YYYY-MM-DD)
  color: string; // アイコンに使う背景色（Tailwindのclassではなく16進）
  memo?: string; // メモ（任意）
  createdAt: number; // 作成日時（並び替え用）
}

// フォームから受け取る入力値（idやcreatedAtは登録時に付与する）
export type SubscriptionInput = Omit<Subscription, "id" | "createdAt">;
