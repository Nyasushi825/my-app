import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "サブスクBox",
  description: "契約中のサブスクを登録して、毎月いくら払っているか一目で把握できる管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
