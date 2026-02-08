import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProviders from "../providers/QueryProviders";
import { Header } from "@/components/common/CommonHeader";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProviders";
import { ModalProvider } from "@/providers/ModalProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { Suspense } from "react";
import { defaultMetadata } from "@/lib/metadata";
import { StructuredData } from "@/components/seo/StructuredData";

const pretendard = localFont({
  src: "../public/fonts/Pretendard.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#9f54ff" },
    { media: "(prefers-color-scheme: dark)", color: "#7d26f0" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${pretendard.className} ${pretendard.variable} antialiased`}
      >
        <StructuredData type="WebSite" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProviders>
            <AuthProvider>
              <ModalProvider>
                <NotificationProvider>
                  <Suspense fallback={null}>
                    <Header />
                    {children}
                  </Suspense>
                </NotificationProvider>
              </ModalProvider>
            </AuthProvider>
          </QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
