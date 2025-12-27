import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProviders from "../providers/QueryProviders";
import { Header } from "@/components/common/CommonHeader";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProviders";
import { ModalProvider } from "@/providers/ModalProvider";
import { Suspense } from "react";
import { defaultMetadata } from "@/lib/metadata";
import { StructuredData } from "@/components/seo/StructuredData";

const pretendard = localFont({
  src: "../public/fonts/Pretendard.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
});

export const metadata: Metadata = defaultMetadata;

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
                <Suspense fallback={null}>
                  <Header />
                  {children}
                </Suspense>
              </ModalProvider>
            </AuthProvider>
          </QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
