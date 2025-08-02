import type { Metadata } from "next";
import "./globals.css";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "모아 | 나에게 필요한 건강만을 모아",
  description: "개인화 건강기능식품 AI 서비스, 모아",
  metadataBase: new URL("https://ai-moa.vercel.app/"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "모아",
    description: "개인화 건강기능식품 AI 서비스, 모아",
    url: "https://ai-moa.vercel.app/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "모아 | 나에게 필요한 건강만을 모아",
      },
    ],
    siteName: "모아",
  },
  twitter: {
    card: "summary_large_image",
    title: "모아",
    description: "개인화 건강기능식품 AI 서비스, 모아",
    images: ["/og-image.jpg"],
  },
  other: {
    "google-site-verification": [],
    "naver-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-[120vh] bg-gradient-to-b from-white to-white text-gray-800 flex flex-col">
        <TopBar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
