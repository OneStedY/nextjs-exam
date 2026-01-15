import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Movies App (TMDB)",
  description: "Movie browser using TMDB API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
          <footer className="mt-10 border-t py-6 text-xs text-slate-500">
            Data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </footer>
        </main>
      </body>
    </html>
  );
}
