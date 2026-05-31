"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

// ヘッダーに置くログイン/ログアウトボタン。
// Supabaseの鍵が未設定のときは何も表示しない（従来どおりlocalStorageで動作）。
export function AuthButton() {
  const { user, loading, isConfigured, signIn, signUp, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 鍵未設定、またはセッション確認中は何も出さない
  if (!isConfigured || loading) return null;

  // ログイン済み：メールアドレスとログアウトボタンを表示
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
          {user.email}
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ログアウト
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const action = mode === "signin" ? signIn : signUp;
    const { error } = await action(email, password);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    if (mode === "signup") {
      // メール確認が有効な場合に備えて案内を出す
      setInfo("登録しました。確認メールが届いた場合はリンクをクリックしてください。");
    }
    setOpen(false);
    setEmail("");
    setPassword("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
          setInfo(null);
        }}
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
      >
        ログイン
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">
              {mode === "signin" ? "ログイン" : "新規登録"}
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              ログインすると、登録したサブスクが端末をまたいで同期されます。
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                  メールアドレス
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                  パスワード
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="6文字以上"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              )}
              {info && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {info}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {busy
                  ? "処理中..."
                  : mode === "signin"
                    ? "ログイン"
                    : "登録する"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setInfo(null);
              }}
              className="mt-4 w-full text-center text-xs text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {mode === "signin"
                ? "アカウントをお持ちでない方はこちら（新規登録）"
                : "すでにアカウントをお持ちの方はこちら（ログイン）"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
