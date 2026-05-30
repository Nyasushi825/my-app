import type { MetadataRoute } from "next";

// PWAマニフェスト（Next.jsのメタデータルート）。/manifest.webmanifest として配信される
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "サブスクBox",
    short_name: "サブスクBox",
    description:
      "契約中のサブスクを登録して、毎月いくら払っているか一目で把握できる管理アプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#4f46e5",
    lang: "ja",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
