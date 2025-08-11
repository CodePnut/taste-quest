import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import BackgroundLayer from "../components/BackgroundLayer";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { ReactQueryClientProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        {/* ThemeProvider controls light/dark via class on html, smoothens switch without flicker */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Query client provides caching/retries for server data */}
          <ReactQueryClientProvider>
            {/* Background visuals are subtle and respect reduced motion */}
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
