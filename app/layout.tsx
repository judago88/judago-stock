import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AutoLogout } from "@/components/auto-logout";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "주다고 기준봉 센터",
  description:
    "주식매매기법 중 기준봉매매에 대한 기법을 이해하기 쉽게 소개하고, 기준봉이 출현한 종목을 데일리로 무료 제공합니다.",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        <AutoLogout />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
