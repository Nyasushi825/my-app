"use client";

import {
  cycleLabel,
  formatDate,
  formatYen,
  toMonthly,
} from "@/lib/format";
import type { Subscription } from "@/lib/types";

// サービス名の頭文字をアイコンに使う
function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

// 登録済みサブスクの一覧
export function SubscriptionList({
  subscriptions,
  editingId,
  onEdit,
  onRemove,
}: {
  subscriptions: Subscription[];
  editingId: string | null;
  onEdit: (sub: Subscription) => void;
  onRemove: (id: string) => void;
}) {
  if (subscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-3xl">📦</p>
        <p className="mt-2 text-sm font-medium text-slate-600">
          まだサブスクが登録されていません
        </p>
        <p className="mt-1 text-xs text-slate-400">
          左のフォームから最初のサブスクを追加しましょう
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {subscriptions.map((sub) => (
        <li
          key={sub.id}
          className={`flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition ${
            editingId === sub.id
              ? "border-brand-500 ring-2 ring-brand-100"
              : "border-slate-200"
          }`}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: sub.color }}
          >
            {initial(sub.name)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-800">{sub.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              次回請求 {formatDate(sub.nextBillingDate)}
              {sub.memo ? ` ・ ${sub.memo}` : ""}
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold text-slate-800">
              {formatYen(sub.price)}
            </p>
            <p className="text-xs text-slate-500">
              {cycleLabel(sub.cycle)}
              {sub.cycle === "yearly" && (
                <span className="ml-1 text-slate-400">
                  (月{formatYen(toMonthly(sub))})
                </span>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onEdit(sub)}
            aria-label={`${sub.name}を編集`}
            className="ml-1 shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onRemove(sub.id)}
            aria-label={`${sub.name}を削除`}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
