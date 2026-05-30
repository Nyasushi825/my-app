import type { SubscriptionInput } from "./types";

// よく使われるサブスクのテンプレート（ワンタップ登録用の最小セット）
// 本家「サブスクBox」は280件超だが、まずは代表的なものだけ用意する。
// cancelUrl は各サービスの公式な解約手順ページ。
export interface Template {
  name: string;
  price: number;
  cycle: SubscriptionInput["cycle"];
  color: string;
  cancelUrl: string;
}

export const TEMPLATES: Template[] = [
  {
    name: "Netflix スタンダード",
    price: 1590,
    cycle: "monthly",
    color: "#e50914",
    cancelUrl: "https://help.netflix.com/ja/node/407",
  },
  {
    name: "Spotify Premium",
    price: 980,
    cycle: "monthly",
    color: "#1db954",
    cancelUrl: "https://support.spotify.com/jp/article/cancel-premium/",
  },
  {
    name: "Amazon Prime",
    price: 600,
    cycle: "monthly",
    color: "#ff9900",
    cancelUrl: "https://www.amazon.co.jp/gp/help/customer/display.html?nodeId=GG8Y3CFFGLR8DR3Q",
  },
  {
    name: "YouTube Premium",
    price: 1280,
    cycle: "monthly",
    color: "#ff0000",
    cancelUrl: "https://support.google.com/youtube/answer/6308278",
  },
  {
    name: "Apple Music",
    price: 1080,
    cycle: "monthly",
    color: "#fa243c",
    cancelUrl: "https://support.apple.com/ja-jp/HT202039",
  },
  {
    name: "Disney+",
    price: 990,
    cycle: "monthly",
    color: "#113ccf",
    cancelUrl: "https://help.disneyplus.com/ja-JP/article/disneyplus-cancel-subscription",
  },
  {
    name: "ChatGPT Plus",
    price: 3000,
    cycle: "monthly",
    color: "#10a37f",
    cancelUrl: "https://help.openai.com/en/articles/6378407",
  },
  {
    name: "Adobe CC",
    price: 7780,
    cycle: "monthly",
    color: "#fa0f00",
    cancelUrl: "https://helpx.adobe.com/jp/manage-account/using/cancel-subscription.html",
  },
];
