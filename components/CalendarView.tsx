"use client";

import { useMemo, useState } from "react";
import { formatYen } from "@/lib/format";
import type { Subscription } from "@/lib/types";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

// nextBillingDate から「請求日（日）」を取り出す
function billingDay(sub: Subscription): number {
  const d = new Date(sub.nextBillingDate + "T00:00:00");
  return Number.isNaN(d.getTime()) ? 0 : d.getDate();
}

// 請求日カレンダー：表示中の月で、各サブスクの請求日にマーカーを表示する
export function CalendarView({ subscriptions }: { subscriptions: Subscription[] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-11

  // 日（1-31）ごとに、その日が請求日のサブスクをまとめる
  const byDay = useMemo(() => {
    const map = new Map<number, Subscription[]>();
    for (const sub of subscriptions) {
      const day = billingDay(sub);
      if (day < 1) continue;
      const list = map.get(day) ?? [];
      list.push(sub);
      map.set(day, list);
    }
    return map;
  }, [subscriptions]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const todayIso = new Date().toISOString().slice(0, 10);

  // カレンダーのセル（先頭の空白 + 各日）を組み立てる
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function shiftMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">請求日カレンダー</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="前の月"
            className="rounded-lg px-2 py-1 text-slate-500 transition hover:bg-slate-100"
          >
            ‹
          </button>
          <span className="min-w-[6.5rem] text-center text-sm font-medium text-slate-700">
            {year}年{month + 1}月
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="次の月"
            className="rounded-lg px-2 py-1 text-slate-500 transition hover:bg-slate-100"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`pb-1 text-xs font-medium ${
              i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-slate-500"
            }`}
          >
            {w}
          </div>
        ))}

        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const subs = byDay.get(day) ?? [];
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day,
          ).padStart(2, "0")}`;
          const isToday = iso === todayIso;

          return (
            <div
              key={day}
              className={`min-h-[3.25rem] rounded-lg border p-1 text-left ${
                isToday ? "border-brand-400 bg-brand-50" : "border-transparent"
              }`}
            >
              <div
                className={`text-xs ${
                  isToday ? "font-bold text-brand-700" : "text-slate-600"
                }`}
              >
                {day}
              </div>
              <div className="mt-0.5 flex flex-wrap gap-0.5">
                {subs.map((s) => (
                  <span
                    key={s.id}
                    title={`${s.name}（${formatYen(s.price)}）`}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {subscriptions.length === 0 && (
        <p className="mt-3 text-center text-xs text-slate-400">
          サブスクを登録すると、請求日がこのカレンダーに表示されます
        </p>
      )}
    </section>
  );
}
