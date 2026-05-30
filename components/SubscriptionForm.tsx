"use client";

import { useEffect, useState } from "react";
import type { BillingCycle, Subscription, SubscriptionInput } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates";

// 今日の日付を YYYY-MM-DD で返す
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_COLOR = "#6366f1";

function emptyForm(): SubscriptionInput {
  return {
    name: "",
    price: 0,
    cycle: "monthly",
    nextBillingDate: today(),
    color: DEFAULT_COLOR,
    memo: "",
  };
}

// Subscription から編集用の入力値だけを取り出す
function toInput(sub: Subscription): SubscriptionInput {
  const { name, price, cycle, nextBillingDate, color, memo } = sub;
  return { name, price, cycle, nextBillingDate, color, memo };
}

// サブスクを登録・編集するフォーム
export function SubscriptionForm({
  editing,
  onAdd,
  onUpdate,
  onCancelEdit,
}: {
  editing: Subscription | null;
  onAdd: (input: SubscriptionInput) => void;
  onUpdate: (id: string, input: SubscriptionInput) => void;
  onCancelEdit: () => void;
}) {
  const [form, setForm] = useState<SubscriptionInput>(emptyForm());
  const [error, setError] = useState<string | null>(null);

  // 編集対象が切り替わったらフォームの内容を同期する
  useEffect(() => {
    setForm(editing ? toInput(editing) : emptyForm());
    setError(null);
  }, [editing]);

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
    const value = { ...form, name: form.name.trim() };
    if (editing) {
      onUpdate(editing.id, value);
    } else {
      onAdd(value);
    }
    setForm(emptyForm());
    setError(null);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-base font-semibold text-slate-800">
        {editing ? "サブスクを編集" : "サブスクを登録"}
      </h2>

      {/* テンプレートからワンタップで入力補助（新規登録時のみ表示） */}
      {!editing && (
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
      )}

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

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          {editing ? "更新する" : "登録する"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
