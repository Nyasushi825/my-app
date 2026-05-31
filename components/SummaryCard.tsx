import { formatYen, totalMonthly, totalYearly } from "@/lib/format";
import type { Subscription } from "@/lib/types";

// 月額合計・年額合計・件数をまとめて表示するサマリーカード
export function SummaryCard({ subscriptions }: { subscriptions: Subscription[] }) {
  const monthly = totalMonthly(subscriptions);
  const yearly = totalYearly(subscriptions);

  return (
    <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-lg shadow-brand-600/20">
      <p className="text-sm font-medium text-brand-100">月額の合計</p>
      <p className="mt-1 text-4xl font-bold tracking-tight">{formatYen(monthly)}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/20 pt-4 text-sm">
        <div>
          <p className="text-brand-100">年間で</p>
          <p className="mt-0.5 text-lg font-semibold">{formatYen(yearly)}</p>
        </div>
        <div>
          <p className="text-brand-100">登録数</p>
          <p className="mt-0.5 text-lg font-semibold">{subscriptions.length}件</p>
        </div>
      </div>
    </section>
  );
}
