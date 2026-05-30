# デプロイ手順（Vercel）

このアプリを携帯・PCで使えるようにするには、**Vercel**（無料ホスティング）にデプロイします。

## 前提条件

- GitHub アカウント（既にある）
- Vercel アカウント（GitHub で無料作成可）

---

## ステップ 1：Vercel にログイン

[vercel.com](https://vercel.com) を開き、**「Sign up」→「Continue with GitHub」** でログイン。

![](https://imgur.com/1234567.png)

---

## ステップ 2：GitHub を認可

Vercel から GitHub のアクセスを許可するダイアログが出たら **「Authorize Vercel」** をクリック。

---

## ステップ 3：プロジェクトをインポート

1. Vercel ダッシュボードで **「Add New」→「Project」** をクリック
2. **「Import Git Repository」** を選択
3. 検索フィールドで `my-app` と入力
4. **`Nyasushi825/my-app`** を選んでクリック

![](https://imgur.com/7890123.png)

---

## ステップ 4：ブランチ指定（重要）

**Deploy Branch** を以下に設定します：

```
Production Branch: claude/trusting-allen-Xk9Oi
```

（デフォルトは `main` ですが、開発コードは `claude/trusting-allen-Xk9Oi` にあります）

---

## ステップ 5：デプロイ

**「Deploy」** をクリック。

- ビルドが始まります（1〜3分）
- 成功すると **`https://my-app-abc123.vercel.app`** のような URL が表示されます

---

## ステップ 6：携帯で開く

1. 発行された URL を**スマートフォンのブラウザで開く**
2. メニューをタップ（右上の `⋮` など）
3. **「ホーム画面に追加」** をタップ
4. アプリ名確認後 **「追加」** をタップ

---

## ✅ 完成！

ホーム画面にアプリアイコンが追加されました。  
タップするとネイティブアプリのように動作します。🎉

---

## 📝 今後のコード更新

コードを更新（新機能追加・バグ修正）した場合：

1. `claude/trusting-allen-Xk9Oi` ブランチにコミット
2. GitHub にプッシュ
3. Vercel が**自動的に**新しいコードをビルド・デプロイ

手動操作は不要です。

---

## トラブルシューティング

### デプロイが失敗する場合
- Vercel ダッシュボードの **「Deployments」** タブでログを確認
- ビルドエラーが出ていたら、GitHub Issue として報告してください

### デプロイは成功したが、アプリが動かない
- ブラウザの **F12（開発者ツール）** → **Console** でエラーメッセージを確認
- キャッシュをクリアして再度アクセス（`Ctrl+Shift+R` または `Cmd+Shift+R`）

---

## 参考：無料範囲内の制限

Vercel Free Plan：
- ✅ デプロイ無制限
- ✅ 月 100GB の帯域幅（個人利用なら十分）
- ✅ 自動 HTTPS
- ❌ API サーバー機能（このアプリは不要）

---

**準備完了！** さあ、デプロイしましょう 🚀
