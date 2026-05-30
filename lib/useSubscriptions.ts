"use client";

import { useCallback, useEffect, useState } from "react";
import type { Subscription, SubscriptionInput } from "./types";

const STORAGE_KEY = "subsuku-box:subscriptions";

// 簡単なユニークID生成（crypto.randomUUIDが使える環境ではそれを使う）
function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// localStorageを使ってサブスク一覧を管理するカスタムフック
export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 初回マウント時にlocalStorageから読み込む
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Subscription[];
        if (Array.isArray(parsed)) setSubscriptions(parsed);
      }
    } catch {
      // 壊れたデータは無視する
    }
    setLoaded(true);
  }, []);

  // 変更があるたびにlocalStorageへ保存する
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    } catch {
      // 保存に失敗しても致命的ではないので無視する
    }
  }, [subscriptions, loaded]);

  const addSubscription = useCallback((input: SubscriptionInput) => {
    const sub: Subscription = {
      ...input,
      id: genId(),
      createdAt: Date.now(),
    };
    setSubscriptions((prev) => [sub, ...prev]);
  }, []);

  // 既存サブスクの内容を更新する（idとcreatedAtは保持）
  const updateSubscription = useCallback(
    (id: string, input: SubscriptionInput) => {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...input } : s)),
      );
    },
    [],
  );

  const removeSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    subscriptions,
    loaded,
    addSubscription,
    updateSubscription,
    removeSubscription,
  };
}
