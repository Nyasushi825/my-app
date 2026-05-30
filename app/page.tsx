"use client";

import { useMemo, useState } from "react";
import { CalendarView } from "@/components/CalendarView";
import { CancelledList } from "@/components/CancelledList";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SummaryCard } from "@/components/SummaryCard";
import { isActive, type Subscription } from "@/lib/types";
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

  // 編集中のサブスク（nullなら新規登録モード）
  const [editing, setEditing] = useState<Subscription | null>(null);

  // 契約中・解約済みに振り分ける
  const active = useMemo(() => subscriptions.filter(isActive), [subscriptions]);
  const cancelled = useMemo(
    () => subscriptions.filter((s) => !isActive(s)),
    [subscriptions],
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
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          サブスクBox
        </h1>
      </header>

      <SummaryCard subscriptions={active} />

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
          <h2 className="mb-3 text-base font-semibold text-slate-800">
            登録中のサブスク
          </h2>
          {loaded ? (
            <SubscriptionList
              subscriptions={active}
              editingId={editing?.id ?? null}
              onEdit={setEditing}
              onCancel={handleCancel}
            />
          ) : (
            <p className="text-sm text-slate-400">読み込み中...</p>
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

      <footer className="mt-12 text-center text-xs text-slate-400">
        データはお使いのブラウザ内（localStorage）に保存されます
      </footer>
    </main>
  );
}
