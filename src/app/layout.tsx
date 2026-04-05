import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LP生成エディタ",
  description: "toB向けランディングページをフォームから簡単に生成",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="mesh-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
