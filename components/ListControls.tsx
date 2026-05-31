"use client";

import { SORT_KEYS, type SortKey } from "@/lib/format";
import { useLanguage } from "./LanguageProvider";

// 一覧の検索ボックスと並び替えセレクト
export function ListControls({
  query,
  sort,
  onQueryChange,
  onSortChange,
}: {
  query: string;
  sort: SortKey;
  onQueryChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="mb-3 flex gap-2">
      <div className="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("search_ph")}
          aria-label={t("search_aria")}
          className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-brand-500/30"
        />
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortKey)}
        aria-label={t("sort_aria")}
        className="rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-600 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:focus:ring-brand-500/30"
      >
        {SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(`sort_${key}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
