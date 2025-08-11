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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryClientProvider>
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
