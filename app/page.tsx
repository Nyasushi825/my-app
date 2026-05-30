"use client";

import { useState } from "react";
import { CalendarView } from "@/components/CalendarView";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SummaryCard } from "@/components/SummaryCard";
import type { Subscription } from "@/lib/types";
import { useSubscriptions } from "@/lib/useSubscriptions";

export default function Home() {
  const {
    subscriptions,
    loaded,
    addSubscription,
    updateSubscription,
    removeSubscription,
  } = useSubscriptions();

  // 編集中のサブスク（nullなら新規登録モード）
  const [editing, setEditing] = useState<Subscription | null>(null);

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

      <SummaryCard subscriptions={subscriptions} />

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
              subscriptions={subscriptions}
              editingId={editing?.id ?? null}
              onEdit={setEditing}
              onRemove={handleRemove}
            />
          ) : (
            <p className="text-sm text-slate-400">読み込み中...</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <CalendarView subscriptions={subscriptions} />
      </div>

      <footer className="mt-12 text-center text-xs text-slate-400">
        データはお使いのブラウザ内（localStorage）に保存されます
      </footer>
    </main>
  );
}
