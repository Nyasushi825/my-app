"use client";

import { useEffect, useState } from "react";
import { FALLBACK_RATES, type Rates } from "./currency";

const CACHE_KEY = "subsuku-box:rates";
const MAX_AGE = 24 * 60 * 60 * 1000; // 24時間以内のキャッシュは再取得しない
// APIキー不要・CORS対応の無料為替レートAPI（USD基準）
const API = "https://open.er-api.com/v6/latest/USD";

export type RateStatus = "loading" | "live" | "fallback";

interface Cached {
  rates: Rates;
  updatedAt: number;
}

// リアルタイム為替レート（各通貨→円）を取得・キャッシュするフック。
// 取得できないときはフォールバックの概算レートで動作を継続する。
export function useExchangeRates() {
  const [rates, setRates] = useState<Rates>(FALLBACK_RATES);
  const [status, setStatus] = useState<RateStatus>("loading");
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    // まずキャッシュを読み、十分新しければそのまま使う
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const c = JSON.parse(raw) as Cached;
        if (c?.rates) {
          setRates(c.rates);
          setUpdatedAt(c.updatedAt);
          setStatus("live");
          if (Date.now() - c.updatedAt < MAX_AGE) return;
        }
      }
    } catch {
      // 壊れたキャッシュは無視する
    }

    // 最新レートを取得（USD基準のレートから「1通貨=何円」を組み立てる）
    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.result !== "success" || !data.rates?.JPY) {
          throw new Error("invalid response");
        }
        const usd = data.rates as Record<string, number>;
        const next: Rates = {
          JPY: 1,
          USD: usd.JPY, // 1ドル = usd.JPY 円
          EUR: usd.EUR ? usd.JPY / usd.EUR : FALLBACK_RATES.EUR, // 1ユーロ = (円/ドル)/(ユーロ/ドル)
        };
        const now = Date.now();
        setRates(next);
        setUpdatedAt(now);
        setStatus("live");
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ rates: next, updatedAt: now } satisfies Cached),
          );
        } catch {
          // 保存失敗は致命的ではないので無視する
        }
      })
      .catch(() => {
        if (cancelled) return;
        // キャッシュ済みなら live のまま、無ければフォールバック表示にする
        setStatus((prev) => (prev === "live" ? "live" : "fallback"));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { rates, status, updatedAt };
}
