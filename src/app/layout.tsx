import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialLinks from "@/components/layout/SocialLinks";
import TrackView from "@/components/TrackView";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mr.Liu's Blog",
    template: "%s | Mr.Liu's Blog",
  },
  description: "以开发视角，编码的设计哲学：从传输到安全。分享网络安全、Web开发、CTF竞赛等技术文章。",
  keywords: ["网络安全", "博客", "Mr.Liu", "HCIA", "HCIP", "Web安全", "CTF"],
  authors: [{ name: "Mr.Liu" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Mr.Liu's Blog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <TrackView />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <SocialLinks />
      </body>
    </html>
  );
}
