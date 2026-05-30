"use client";

import { useState } from "react";
import type { BillingCycle, SubscriptionInput } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates";

// 今日の日付を YYYY-MM-DD で返す
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_COLOR = "#6366f1";

const emptyForm: SubscriptionInput = {
  name: "",
  price: 0,
  cycle: "monthly",
  nextBillingDate: today(),
  color: DEFAULT_COLOR,
  memo: "",
};

// サブスクを新規登録するフォーム
export function SubscriptionForm({
  onAdd,
}: {
  onAdd: (input: SubscriptionInput) => void;
}) {
  const [form, setForm] = useState<SubscriptionInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof SubscriptionInput>(
    key: K,
    value: SubscriptionInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("サービス名を入力してください");
      return;
    }
    if (!form.price || form.price <= 0) {
      setError("金額は1円以上で入力してください");
      return;
    }
    onAdd({ ...form, name: form.name.trim() });
    setForm({ ...emptyForm, nextBillingDate: today() });
    setError(null);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-base font-semibold text-slate-800">サブスクを登録</h2>

      {/* テンプレートからワンタップで入力補助 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {TEMPLATES.map((t) => (
          <button
            key={t.name}
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                name: t.name,
                price: t.price,
                cycle: t.cycle,
                color: t.color,
              }))
            }
            className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 transition hover:border-brand-300 hover:bg-brand-50"
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            サービス名
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="例: Netflix"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              金額（円）
            </label>
            <input
              type="number"
              min={0}
              value={form.price || ""}
              onChange={(e) => update("price", Number(e.target.value))}
              placeholder="1490"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              請求サイクル
            </label>
            <select
              value={form.cycle}
              onChange={(e) => update("cycle", e.target.value as BillingCycle)}
              className={inputClass}
            >
              <option value="monthly">月額</option>
              <option value="yearly">年額</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              次回請求日
            </label>
            <input
              type="date"
              value={form.nextBillingDate}
              onChange={(e) => update("nextBillingDate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              カラー
            </label>
            <input
              type="color"
              value={form.color}
              onChange={(e) => update("color", e.target.value)}
              className="h-[38px] w-full cursor-pointer rounded-lg border border-slate-300 p-1"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            メモ（任意）
          </label>
          <input
            type="text"
            value={form.memo ?? ""}
            onChange={(e) => update("memo", e.target.value)}
            placeholder="家族と共有 など"
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        登録する
      </button>
    </form>
  );
}
