import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
    <html lang="ja" suppressHydrationWarning>
      <body>
        {/* FOUC防止: ページ描画前にlocalStorageのテーマを適用 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('lp_theme')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}`,
          }}
        />
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
