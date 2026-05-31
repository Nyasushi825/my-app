"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_LANG,
  LANGUAGES,
  LOCALE,
  type Lang,
  type TKey,
  translations,
  interpolate,
} from "@/lib/i18n";

const STORAGE_KEY = "subsuku-box:lang";

interface Ctx {
  lang: Lang;
  locale: string;
  setLang: (l: Lang) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<Ctx | null>(null);

// 保存済みの設定を優先し、無ければブラウザの言語から推定する
function detect(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
    const nav = navigator.language.slice(0, 2).toLowerCase();
    const match = LANGUAGES.find((l) => l.code === nav);
    if (match) return match.code;
  } catch {
    // 取得に失敗しても既定言語にフォールバック
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // SSR と hydration 直後は既定言語で描画し、マウント後に切り替える
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const next = detect();
    setLangState(next);
    document.documentElement.lang = next;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // 保存失敗は無視
    }
  }, []);

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) =>
      interpolate(translations[lang][key] ?? translations.ja[key] ?? key, vars),
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, locale: LOCALE[lang], setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
