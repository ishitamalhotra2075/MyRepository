import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { LibraryProvider } from "@/context/LibraryContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PwaPrompt } from "@/components/layout/PwaPrompt";
import { PaperUploadModal } from "@/components/library/PaperUploadModal";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "ResearchGPT - AI-Powered Scientific Research Assistant",
  description: "Next-generation research ecosystem: Grounded multi-paper chat (AnswerThis), academic language auditor & fake citation detector (Paperpal), and writing copilot (Jenni AI).",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ResearchGPT",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-indigo-500/30">
        <ThemeProvider>
          <ToastProvider>
            <LibraryProvider>
              <AppShell>
                {children}
              </AppShell>
              <PwaPrompt />
            </LibraryProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
