import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "サブスクBox",
  description:
    "契約中のサブスクを登録して、毎月いくら払っているか一目で把握できる管理アプリ",
  applicationName: "サブスクBox",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "サブスクBox",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  // スマホのブラウザUI（アドレスバー）の色をライト/ダークで切り替える
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

// 描画前に <html> へ dark クラスを付け、テーマのちらつき（FOUC）を防ぐ。
// 保存済みの設定を優先し、未設定ならOSの prefers-color-scheme に従う。
const themeScript = `(function(){try{var t=localStorage.getItem("subsuku-box:theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
