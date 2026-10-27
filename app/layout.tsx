import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Sidebar from "./components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CASEFILE ZERO — The Last Alibi",
  description:
    "A confidential vintage detective investigation. Unravel a locked-room murder, examine forensic evidence, and interrogate suspects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-[#100D08] text-[#E8DCC0]">
        {/* Warm Vintage Detective Atmospheric Overlays */}
        <div className="vintage-atmosphere" />
        <div className="vintage-vignette" />

        <Sidebar />

        {/* Main Content Area (Offset left on desktop for fixed sidebar) */}
        <main className="flex-1 md:pl-64 min-h-screen pt-14 md:pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
