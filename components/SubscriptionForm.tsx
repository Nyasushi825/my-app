"use client";

import { useEffect, useState } from "react";
import type {
  BillingCycle,
  Currency,
  Subscription,
  SubscriptionInput,
} from "@/lib/types";
import { CURRENCIES } from "@/lib/currency";
import { TEMPLATES } from "@/lib/templates";
import { useLanguage } from "./LanguageProvider";

// 今日の日付を YYYY-MM-DD で返す
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_COLOR = "#6366f1";

function emptyForm(): SubscriptionInput {
  return {
    name: "",
    price: 0,
    currency: "JPY",
    cycle: "monthly",
    nextBillingDate: today(),
    color: DEFAULT_COLOR,
    memo: "",
    cancelUrl: "",
  };
}

// Subscription から編集用の入力値だけを取り出す
function toInput(sub: Subscription): SubscriptionInput {
  const { name, price, currency, cycle, nextBillingDate, color, memo, cancelUrl } =
    sub;
  return {
    name,
    price,
    currency: currency ?? "JPY",
    cycle,
    nextBillingDate,
    color,
    memo,
    cancelUrl,
  };
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
  const { t } = useLanguage();
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
      setError(t("err_name"));
      return;
    }
    if (!form.price || form.price <= 0) {
      setError(t("err_price"));
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
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-brand-500/30";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {editing ? t("form_edit_title") : t("form_add_title")}
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
                  currency: "JPY",
                  cycle: t.cycle,
                  color: t.color,
                  cancelUrl: t.cancelUrl,
                }))
              }
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 dark:border-slate-600 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:bg-slate-800"
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            {t("field_name")}
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder={t("ph_name")}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t("field_price")}
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={form.price || ""}
              onChange={(e) => update("price", Number(e.target.value))}
              placeholder="1490"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t("field_currency")}
            </label>
            <select
              value={form.currency ?? "JPY"}
              onChange={(e) => update("currency", e.target.value as Currency)}
              className={inputClass}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {t(`cur_${c.code}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t("field_cycle")}
            </label>
            <select
              value={form.cycle}
              onChange={(e) => update("cycle", e.target.value as BillingCycle)}
              className={inputClass}
            >
              <option value="monthly">{t("cycle_monthly")}</option>
              <option value="yearly">{t("cycle_yearly")}</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              {t("field_next_billing")}
            </label>
            <input
              type="date"
              value={form.nextBillingDate}
              onChange={(e) => update("nextBillingDate", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            {t("field_color")}
          </label>
          <input
            type="color"
            value={form.color}
            onChange={(e) => update("color", e.target.value)}
            className="h-[38px] w-full cursor-pointer rounded-lg border border-slate-300 p-1 dark:border-slate-600 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            {t("field_cancel_url")}
          </label>
          <input
            type="url"
            value={form.cancelUrl ?? ""}
            onChange={(e) => update("cancelUrl", e.target.value)}
            placeholder={t("ph_url")}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            {t("field_memo")}
          </label>
          <input
            type="text"
            value={form.memo ?? ""}
            onChange={(e) => update("memo", e.target.value)}
            placeholder={t("ph_memo")}
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
          {editing ? t("btn_update") : t("btn_add")}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t("btn_cancel")}
          </button>
        )}
      </div>
    </form>
  );
}
