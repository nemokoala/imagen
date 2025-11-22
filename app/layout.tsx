import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProviders from "../providers/QueryProviders";
import { Header } from "@/components/common/CommonHeader";
import AuthProvider from "@/providers/AuthProviders";
import { ThemeProvider } from "@/providers/ThemeProvider";

const pretendard = localFont({
  src: "../public/fonts/Pretendard.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Imagen",
  description: "이미지를 생성하는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${pretendard.className} ${pretendard.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProviders>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
