import { Metadata } from "next";

export const siteConfig = {
  name: "ImageGen",
  description: "AI로 이미지를 생성하고 공유하는 서비스",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://image-gen.store",
  ogImage: "/images/logo.png",
  twitterHandle: "@imagegen",
  locale: "ko_KR",
};

export function createMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullDescription = description || siteConfig.description;
  const fullUrl = `${siteConfig.url}${path}`;
  const ogImageUrl = image
    ? image.startsWith("http")
      ? image
      : `${siteConfig.url}${image}`
    : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [
      "AI 이미지 생성",
      "이미지 생성",
      "AI 아트",
      "Stable Diffusion",
      "Z Image",
      "DALL-E",
      "이미지 갤러리",
      "AI 아트워크",
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/icon.png", sizes: "any" },
        { url: "/images/favicon.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [
        { url: "/icon.png", sizes: "180x180", type: "image/png" },
        { url: "/images/favicon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/icon.png",
    },
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImageUrl],
      creator: siteConfig.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "U3jI9Lgs_ByKDr7UWJIUXbz0mufu5hgEOZdmC6Oz2LA",
      // Naver Search Advisor verification code를 여기에 추가하세요
      // other: {
      //   "naver-site-verification": "your-naver-verification-code",
      // },
    },
  };
}

export const defaultMetadata = createMetadata({});
