"use client";

import { useMemo, useState } from "react";
import { CalendarView } from "@/components/CalendarView";
import { CancelledList } from "@/components/CancelledList";
import { ListControls } from "@/components/ListControls";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SummaryCard } from "@/components/SummaryCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { filterAndSort, type SortKey } from "@/lib/format";
import { isActive, type Subscription } from "@/lib/types";
import { useExchangeRates } from "@/lib/useExchangeRates";
import { useSubscriptions } from "@/lib/useSubscriptions";

export default function Home() {
  const {
    subscriptions,
    loaded,
    addSubscription,
    updateSubscription,
    cancelSubscription,
    restoreSubscription,
    removeSubscription,
  } = useSubscriptions();

  // 為替レート（各通貨→円。リアルタイム取得＋キャッシュ）
  const { rates, status: rateStatus, updatedAt: rateUpdatedAt } =
    useExchangeRates();

  // 編集中のサブスク（nullなら新規登録モード）
  const [editing, setEditing] = useState<Subscription | null>(null);

  // 一覧の検索・並び替え
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("created");

  // 契約中・解約済みに振り分ける
  const active = useMemo(() => subscriptions.filter(isActive), [subscriptions]);
  const cancelled = useMemo(
    () => subscriptions.filter((s) => !isActive(s)),
    [subscriptions],
  );

  // 一覧表示用に絞り込み・並び替えした契約中サブスク（合計やカレンダーには影響しない）
  const visibleActive = useMemo(
    () => filterAndSort(active, query, sort, rates),
    [active, query, sort, rates],
  );

  function handleCancel(id: string) {
    if (editing?.id === id) setEditing(null);
    cancelSubscription(id);
  }

  function handleRemove(id: string) {
    if (editing?.id === id) setEditing(null);
    removeSubscription(id);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-6 flex items-center gap-2">
        <span className="text-2xl">📦</span>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          サブスクBox
        </h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <SummaryCard
        subscriptions={active}
        rates={rates}
        rateStatus={rateStatus}
        rateUpdatedAt={rateUpdatedAt}
      />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <SubscriptionForm
          editing={editing}
          onAdd={addSubscription}
          onUpdate={(id, input) => {
            updateSubscription(id, input);
            setEditing(null);
          }}
          onCancelEdit={() => setEditing(null)}
        />

        <div>
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-200">
            登録中のサブスク
            {active.length > 0 && (
              <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
                {active.length}件
              </span>
            )}
          </h2>
          {loaded ? (
            <>
              {active.length > 0 && (
                <ListControls
                  query={query}
                  sort={sort}
                  onQueryChange={setQuery}
                  onSortChange={setSort}
                />
              )}
              {query && visibleActive.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
                  「{query}」に一致するサブスクはありません
                </p>
              ) : (
                <SubscriptionList
                  subscriptions={visibleActive}
                  editingId={editing?.id ?? null}
                  rates={rates}
                  onEdit={setEditing}
                  onCancel={handleCancel}
                />
              )}
            </>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500">読み込み中...</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <CalendarView subscriptions={active} />
      </div>

      <CancelledList
        subscriptions={cancelled}
        onRestore={restoreSubscription}
        onRemove={handleRemove}
      />

      <footer className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500">
        データはお使いのブラウザ内（localStorage）に保存されます
      </footer>
    </main>
  );
}
