"use client";

import { SubscriptionForm } from "@/components/SubscriptionForm";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SummaryCard } from "@/components/SummaryCard";
import { useSubscriptions } from "@/lib/useSubscriptions";

export default function Home() {
  const { subscriptions, loaded, addSubscription, removeSubscription } =
    useSubscriptions();

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
        <SubscriptionForm onAdd={addSubscription} />

        <div>
          <h2 className="mb-3 text-base font-semibold text-slate-800">
            登録中のサブスク
          </h2>
          {loaded ? (
            <SubscriptionList
              subscriptions={subscriptions}
              onRemove={removeSubscription}
            />
          ) : (
            <p className="text-sm text-slate-400">読み込み中...</p>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-slate-400">
        データはお使いのブラウザ内（localStorage）に保存されます
      </footer>
    </main>
  );
}
