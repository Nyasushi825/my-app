"use client";

import { useState } from "react";
import { totalMonthlyJPY, totalYearlyJPY } from "@/lib/format";
import {
  CURRENCIES,
  formatMoney,
  type Rates,
} from "@/lib/currency";
import type { Currency, Subscription } from "@/lib/types";
import type { RateStatus } from "@/lib/useExchangeRates";

// 月額合計・年額合計・件数をまとめて表示するサマリーカード。
// 複数通貨のサブスクを基準通貨に換算して合計する。
export function SummaryCard({
  subscriptions,
  rates,
  rateStatus,
  rateUpdatedAt,
}: {
  subscriptions: Subscription[];
  rates: Rates;
  rateStatus: RateStatus;
  rateUpdatedAt: number | null;
}) {
  // 合計を表示する基準通貨（切り替え可能）
  const [base, setBase] = useState<Currency>("JPY");

  const monthlyJPY = totalMonthlyJPY(subscriptions, rates);
  const yearlyJPY = totalYearlyJPY(subscriptions, rates);
  // 円換算の合計を基準通貨へ戻す
  const toBase = (jpy: number) => jpy / (rates[base] ?? 1);

  // 為替の状態表示（更新時刻 or フォールバック中）
  const rateNote =
    rateStatus === "fallback"
      ? "為替APIに接続できないため概算レートで表示中"
      : rateStatus === "loading"
        ? "為替レートを取得中…"
        : `1$≈${formatMoney(rates.USD, "JPY")} ・ 1€≈${formatMoney(rates.EUR, "JPY")}${
            rateUpdatedAt
              ? `（${new Date(rateUpdatedAt).toLocaleDateString("ja-JP")}更新）`
              : ""
          }`;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-lg shadow-brand-600/20">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-brand-100">月額の合計</p>
        {/* 基準通貨の切り替え */}
        <div className="flex rounded-lg bg-white/15 p-0.5 text-xs">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setBase(c.code)}
              className={`rounded-md px-2 py-1 font-medium transition ${
                base === c.code
                  ? "bg-white text-brand-700"
                  : "text-brand-100 hover:text-white"
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-1 text-4xl font-bold tracking-tight">
        {formatMoney(toBase(monthlyJPY), base)}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/20 pt-4 text-sm">
        <div>
          <p className="text-brand-100">年間で</p>
          <p className="mt-0.5 text-lg font-semibold">
            {formatMoney(toBase(yearlyJPY), base)}
          </p>
        </div>
        <div>
          <p className="text-brand-100">登録数</p>
          <p className="mt-0.5 text-lg font-semibold">{subscriptions.length}件</p>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-brand-100">💱 {rateNote}</p>
    </section>
  );
}
