"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "subsuku-box:theme";

// SSR 後の hydration 前に layout.tsx のインラインスクリプトで
// <html class="dark"> を確定させているので、その結果を初期値として読む
function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// ライト/ダークの切り替えを localStorage 保存つきで管理するフック
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  // hydration ミスマッチを避けるため、マウント後にのみアイコンを切り替える
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
    setMounted(true);
  }, []);

  const apply = useCallback((next: Theme) => {
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 保存に失敗してもアプリ本体には影響させない
    }
  }, []);

  const toggle = useCallback(() => {
    apply(currentTheme() === "dark" ? "light" : "dark");
  }, [apply]);

  return { theme, toggle, mounted };
}
