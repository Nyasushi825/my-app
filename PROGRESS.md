# サブスクBox 開発進捗まとめ

## 概要

Next.js + TypeScript + Tailwind CSS で構築したサブスク（定期課金）管理アプリ。  
ShinCode さん公開アプリを参考に、同じ技術スタックで MVP から機能を積み上げた。

---

## 完了した機能（コミット順）

### 1. MVP — サブスク登録・一覧・合計金額 `e2e1578`

| 機能 | 詳細 |
|------|------|
| 登録フォーム | サービス名・金額・サイクル（月額/年額）・次回請求日・カラー・メモ |
| 一覧表示 | カード形式。年額は月額換算を併記 |
| サマリー | 月額合計・年額合計・登録件数を自動計算 |
| テンプレート | Netflix / Spotify 等をワンタップ入力補助（公式解約 URL 付き）|
| データ永続化 | `localStorage` に保存（サーバー不要） |

**主要ファイル**
```
app/page.tsx                 トップページ
components/SummaryCard.tsx   サマリー表示
components/SubscriptionForm.tsx  登録フォーム＋テンプレート
components/SubscriptionList.tsx  一覧
lib/types.ts / format.ts / useSubscriptions.ts / templates.ts
```

---

### 2. 請求日カレンダー＋編集 `abdabe7`

- 月ごとのカレンダー上に請求日をカラーで可視化（前後月へ移動可）
- 登録済みサブスクをフォームで編集

**追加ファイル**
```
components/CalendarView.tsx  請求日カレンダー
```

---

### 3. 解約機能・公式解約手順リンク `6755383`

- 解約は**削除ではなく履歴として保存**
- 解約履歴タブから復元・完全削除が可能
- `templates.ts` に公式解約 URL を保持し、解約時にリンク表示

**追加ファイル**
```
components/CancelledList.tsx  解約履歴一覧
```

---

### 4. 検索・並び替え `2d331ed`

- 名前 / メモでリアルタイム検索
- 並び替え：登録順 / 月額が高い順 / 請求日が近い順

**追加ファイル**
```
components/ListControls.tsx  検索バー＋ソートセレクタ
```

---

### 5. PWA 対応 `78e7423`

- Web App Manifest（`app/manifest.ts`）
- Service Worker（`public/sw.js`）でオフラインキャッシュ
- アイコン 3 種（192px / 512px / maskable 512px）+ apple-touch-icon
- ホーム画面追加でネイティブアプリ風に起動

**追加ファイル**
```
app/manifest.ts
public/sw.js
public/icon-192.png / icon-512.png / icon-maskable-512.png / icon.svg / apple-touch-icon.png
components/ServiceWorkerRegister.tsx  クライアント側 SW 登録
```

---

## 技術スタック

| 項目 | バージョン |
|------|-----------|
| Next.js | 16（App Router） |
| React | 19 |
| TypeScript | 最新安定版 |
| Tailwind CSS | v4 |

---

## ブランチ

```
main                          初期コミット
claude/trusting-allen-Xk9Oi   開発ブランチ（現在）
```

---

## 残課題 / 今後の拡張アイデア

- [ ] **ダークモード** — Tailwind の `dark:` クラスで切り替え、設定を localStorage に保存
- [ ] **多通貨対応** — USD / EUR など円以外の通貨表示
- [ ] **通知** — 請求日 X 日前にブラウザ Push 通知
- [ ] **Supabase 連携** — アカウント間で同期（Shinさんの構成に合わせる）
- [ ] **学生・家族プランテンプレ** — プラン別テンプレート拡充
- [ ] **データエクスポート** — CSV / JSON ダウンロード

---

## ディレクトリ構成（現在）

```
my-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── manifest.ts
│   └── page.tsx
├── components/
│   ├── CalendarView.tsx
│   ├── CancelledList.tsx
│   ├── ListControls.tsx
│   ├── ServiceWorkerRegister.tsx
│   ├── SubscriptionForm.tsx
│   ├── SubscriptionList.tsx
│   └── SummaryCard.tsx
├── lib/
│   ├── format.ts
│   ├── templates.ts
│   ├── types.ts
│   └── useSubscriptions.ts
├── public/
│   ├── sw.js
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-512.png
│   ├── icon.svg
│   └── apple-touch-icon.png
├── PROGRESS.md              ← このファイル
└── README.md
```
