"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Subscription, SubscriptionInput } from "./types";

const STORAGE_KEY = "subsuku-box:subscriptions";
// クラウド側のテーブル名（1ユーザー1行に全サブスクをJSONで保持）
const TABLE = "user_data";

// 簡単なユニークID生成（crypto.randomUUIDが使える環境ではそれを使う）
function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// localStorageから読み込む（共通ヘルパー）
function readLocal(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Subscription[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // 壊れたデータは無視する
  }
  return [];
}

// サブスク一覧を管理するカスタムフック。
// ログイン中（かつSupabase設定済み）ならクラウドに同期し、
// それ以外は従来どおり localStorage に保存する。
export function useSubscriptions() {
  const { user, isConfigured } = useAuth();
  const cloud = isConfigured && !!user && !!supabase;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 保存先を識別するキー（ログイン状態が変わると切り替わる）
  const target = cloud ? `cloud:${user.id}` : "local";
  const targetRef = useRef(target);

  // 保存先が変わるたびに読み込み直す
  useEffect(() => {
    let cancelled = false;
    targetRef.current = target;
    setLoaded(false);

    (async () => {
      if (cloud && supabase) {
        // クラウドから読み込む
        const { data, error } = await supabase
          .from(TABLE)
          .select("subscriptions")
          .eq("user_id", user.id)
          .maybeSingle();
        if (cancelled) return;

        if (!error && data?.subscriptions) {
          setSubscriptions(data.subscriptions as Subscription[]);
        } else {
          // クラウドに未保存 → 初回ログイン。手元（localStorage）のデータを引き継ぐ
          const local = readLocal();
          setSubscriptions(local);
          await supabase.from(TABLE).upsert({
            user_id: user.id,
            subscriptions: local,
            updated_at: new Date().toISOString(),
          });
        }
      } else {
        // localStorageモード
        const local = readLocal();
        if (cancelled) return;
        setSubscriptions(local);
      }
      if (!cancelled) setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // 変更があるたびに保存する（現在の保存先に対してのみ）
  useEffect(() => {
    if (!loaded) return;
    if (targetRef.current !== target) return; // 切り替え直後の取りこぼし防止

    if (cloud && supabase && user) {
      // クロージャ内で型の絞り込みが失われないようローカルに退避
      const client = supabase;
      const userId = user.id;
      // クラウドへ保存（連続変更をまとめるため少し遅らせる）
      const id = setTimeout(() => {
        client
          .from(TABLE)
          .upsert({
            user_id: userId,
            subscriptions,
            updated_at: new Date().toISOString(),
          })
          .then(() => {
            // 保存失敗はここでは致命的でないため無視
          });
      }, 600);
      return () => clearTimeout(id);
    }

    // localStorageへ保存
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    } catch {
      // 保存に失敗しても致命的ではないので無視する
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions, loaded, target]);

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

  // 解約する（削除せず履歴として残す）
  const cancelSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "cancelled", cancelledAt: Date.now() }
          : s,
      ),
    );
  }, []);

  // 解約を取り消して契約中に戻す
  const restoreSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "active", cancelledAt: undefined } : s,
      ),
    );
  }, []);

  const removeSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    subscriptions,
    loaded,
    addSubscription,
    updateSubscription,
    cancelSubscription,
    restoreSubscription,
    removeSubscription,
  };
}
