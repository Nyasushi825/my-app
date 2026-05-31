"use client";

import { formatDate, toMonthly } from "@/lib/format";
import { convert, formatMoney, getCurrency, type Rates } from "@/lib/currency";
import type { Subscription } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

// サービス名の頭文字をアイコンに使う
function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

// 契約中サブスクの一覧（編集・解約手順リンク・解約）
export function SubscriptionList({
  subscriptions,
  editingId,
  rates,
  onEdit,
  onCancel,
}: {
  subscriptions: Subscription[];
  editingId: string | null;
  rates: Rates;
  onEdit: (sub: Subscription) => void;
  onCancel: (id: string) => void;
}) {
  const { t, locale } = useLanguage();

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <p className="text-3xl">📦</p>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          {t("empty_title")}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {t("empty_hint")}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {subscriptions.map((sub) => (
        <li
          key={sub.id}
          className={`rounded-2xl border bg-white p-4 shadow-sm transition dark:bg-slate-900 ${
            editingId === sub.id
              ? "border-brand-500 ring-2 ring-brand-100 dark:ring-brand-500/30"
              : "border-slate-200 dark:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: sub.color }}
            >
              {initial(sub.name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{sub.name}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {t("next_billing_date", {
                  date: formatDate(sub.nextBillingDate, locale),
                })}
                {sub.memo ? ` ・ ${sub.memo}` : ""}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {formatMoney(sub.price, getCurrency(sub))}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t(sub.cycle === "yearly" ? "cycle_yearly" : "cycle_monthly")}
                {sub.cycle === "yearly" && (
                  <span className="ml-1 text-slate-400 dark:text-slate-500">
                    (
                    {t("monthly_equiv", {
                      amount: formatMoney(toMonthly(sub), getCurrency(sub)),
                    })}
                    )
                  </span>
                )}
              </p>
              {/* 外貨は円換算の目安も表示 */}
              {getCurrency(sub) !== "JPY" && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t("approx_monthly", {
                    amount: formatMoney(
                      convert(toMonthly(sub), getCurrency(sub), "JPY", rates),
                      "JPY",
                    ),
                  })}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onEdit(sub)}
              aria-label={t("aria_edit", { name: sub.name })}
              className="ml-1 shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-brand-400"
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
          </div>

          {/* 解約手順リンク＋解約ボタン */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
            {sub.cancelUrl ? (
              <a
                href={sub.cancelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                {t("see_cancel_steps")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            ) : (
              <span className="text-xs text-slate-300 dark:text-slate-600">
                {t("no_cancel_url")}
              </span>
            )}

            <button
              type="button"
              onClick={() => onCancel(sub.id)}
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              {t("cancel_action")}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
