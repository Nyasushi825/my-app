"use client";

import { cycleLabel, formatYen } from "@/lib/format";
import type { Subscription } from "@/lib/types";

// 解約日時を「2026/5/30」形式に整形する
function formatCancelledAt(ts?: number): string {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

// 解約済みサブスクの履歴（復元・削除）
export function CancelledList({
  subscriptions,
  onRestore,
  onRemove,
}: {
  subscriptions: Subscription[];
  onRestore: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  if (subscriptions.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-200">
        解約履歴
        <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
          {subscriptions.length}件
        </span>
      </h2>

      <ul className="space-y-2">
        {subscriptions.map((sub) => (
          <li
            key={sub.id}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-500 line-through dark:text-slate-400">
                {sub.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                {formatYen(sub.price)} / {cycleLabel(sub.cycle)}
                {sub.cancelledAt && ` ・ ${formatCancelledAt(sub.cancelledAt)} に解約`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRestore(sub.id)}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-brand-600 transition hover:bg-brand-50 dark:border-slate-600 dark:bg-slate-900 dark:text-brand-400 dark:hover:bg-slate-800"
            >
              復元
            </button>
            <button
              type="button"
              onClick={() => onRemove(sub.id)}
              aria-label={`${sub.name}を完全に削除`}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950 dark:hover:text-red-400"
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
    </section>
  );
}
