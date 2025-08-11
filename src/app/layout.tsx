import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import BackgroundLayer from "../components/BackgroundLayer";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ReactQueryClientProvider } from "./providers";

// Load two variable fonts from Google via Next's font loader.
// The "variable" key exposes a CSS custom property that we use in Tailwind tokens.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Route metadata controls <title> and description for SEO/link previews.
export const metadata: Metadata = {
  title: "TasteQuest — Healthy recipes, gamified",
  description: "Discover healthy recipes and turn cooking into quests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning avoids React warning when theme class differs between SSR and client
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ThemeProvider controls light/dark via class on html. disableTransitionOnChange avoids flash when toggling. */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* React Query client caches server data and handles retries to make data UX snappy. */}
          <ReactQueryClientProvider>
            {/* Background visuals: subtle, low‑CPU, and respect reduced motion for accessibility. */}
            <BackgroundLayer>
              {children}
              <Analytics />
            </BackgroundLayer>
          </ReactQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
