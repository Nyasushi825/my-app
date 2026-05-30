# 📦 サブスクBox

契約中のサブスク（定期課金サービス）を登録して、**毎月いくら払っているか**を一目で把握できる管理アプリです。
プログラミング系YouTuber [Shin（ShinCode）](https://x.com/Shin_Engineer) さんが公開しているアプリ「サブスクBox」を参考に、同じ技術スタック（Next.js + TypeScript）で作っています。

## 機能（MVP）

- ✅ **サブスク登録** … サービス名・金額・請求サイクル（月額/年額）・次回請求日・カラー・メモを登録
- ✅ **一覧表示** … 登録したサブスクをカード形式で一覧表示。年額は月額換算も併記
- ✅ **合計金額** … 月額合計・年額合計・登録件数を自動計算してサマリー表示
- 📅 **請求日カレンダー** … 月ごとのカレンダー上に各サブスクの請求日をカラーで可視化（前後の月へ移動可）
- ✏️ **編集** … 登録済みサブスクの内容をフォームで編集
- 🔎 **検索・並び替え** … 名前/メモで検索、登録順・月額が高い順・請求日が近い順で並び替え
- 🗑️ **解約・履歴** … 解約は履歴として残し、復元や完全削除も可能。公式の解約手順リンクも表示
- 📲 **PWA対応** … ホーム画面に追加してアプリのように起動、Service Workerでオフラインでも開ける
- 🧩 テンプレート … Netflix / Spotify などの代表的なサービスをワンタップで入力補助（公式解約URL付き）

データはお使いのブラウザの `localStorage` に保存されます（サーバー不要ですぐ動きます）。

## 技術スタック

- [Next.js 16](https://nextjs.org/)（App Router）
- React 19 / TypeScript
- Tailwind CSS

## 開発

```bash
npm install      # 依存関係をインストール
npm run dev      # 開発サーバー起動（http://localhost:3000）
npm run build    # 本番ビルド
npm start        # 本番サーバー起動
```

## ディレクトリ構成

```
app/
  layout.tsx              ルートレイアウト（メタデータ・言語設定）
  page.tsx               トップページ（全体の組み立て）
  globals.css            Tailwindのエントリ
components/
  SummaryCard.tsx        月額・年額・件数のサマリー
  SubscriptionForm.tsx   登録／編集フォーム＋テンプレート
  SubscriptionList.tsx   一覧表示＋編集・削除
  CalendarView.tsx       請求日を月カレンダーで可視化
lib/
  types.ts               型定義（Subscription など）
  format.ts              金額・日付・月額換算のユーティリティ
  useSubscriptions.ts    localStorage連携のカスタムフック
  templates.ts           代表的なサブスクのテンプレート
```

## 今後の拡張アイデア

- 🔗 各サービスの公式解約手順リンク＆解約履歴
- 👨‍👩‍👧 学生・家族プランのテンプレ拡充
- ☁️ Supabase 連携でアカウント間同期（Shinさんの構成に合わせる）
