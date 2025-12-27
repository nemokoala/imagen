import { siteConfig } from "@/lib/metadata";

interface StructuredDataProps {
  type?: "WebSite" | "WebPage" | "ImageGallery";
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

export function StructuredData({
  type = "WebSite",
  title,
  description,
  url,
  image,
}: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://image-gen.store";

  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      name: title || siteConfig.name,
      description: description || siteConfig.description,
      url: url || baseUrl,
    };

    if (type === "ImageGallery") {
      return {
        ...baseData,
        image: image || `${baseUrl}${siteConfig.ogImage}`,
      };
    }

    return baseData;
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
    />
  );
}
