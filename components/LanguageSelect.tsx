"use client";

import { LANGUAGES, type Lang } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

// ヘッダーに置く言語切り替えセレクト
export function LanguageSelect() {
  const { lang, setLang, t } = useLanguage();

  return (
    <select
      aria-label={t("lang_aria")}
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-600 outline-none transition hover:bg-slate-50 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
