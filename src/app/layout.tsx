import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const sans = Inter({
  variable: "--font-sans-var",
  subsets: ["latin"],
});

const display = Instrument_Serif({
  variable: "--font-display-var",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-var",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zomo Design — 设计风格提取",
  description:
    "上传图片，提取设计风格提示词。内置多种设计风格，一键生成风格描述、Markdown、CSS 与 Prompt，并用多个文生图模型对比效果。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
