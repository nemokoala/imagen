import { siteConfig } from "@/lib/metadata";

interface ImageObjectData {
  contentUrl: string;
  url: string;
  name: string;
  description: string;
  creator?: {
    "@type": "Person";
    name: string;
  };
  dateCreated?: string | Date;
  encodingFormat?: string;
  width?: number;
  height?: number;
  license?: string;
}

interface StructuredDataProps {
  type?: "WebSite" | "WebPage" | "ImageGallery" | "ImageObject";
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  imageObject?: ImageObjectData;
}

export function StructuredData({
  type = "WebSite",
  title,
  description,
  url,
  image,
  imageObject,
}: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://image-gen.store";

  const getStructuredData = () => {
    if (type === "ImageObject" && imageObject) {
      return {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        contentUrl: imageObject.contentUrl,
        url: imageObject.url,
        name: imageObject.name,
        description: imageObject.description,
        thumbnailUrl: imageObject.contentUrl,
        ...(imageObject.creator && { creator: imageObject.creator }),
        ...(imageObject.dateCreated && {
          dateCreated:
            typeof imageObject.dateCreated === "string"
              ? imageObject.dateCreated
              : imageObject.dateCreated.toISOString(),
        }),
        ...(imageObject.encodingFormat && {
          encodingFormat: imageObject.encodingFormat,
        }),
        ...(imageObject.width && { width: imageObject.width }),
        ...(imageObject.height && { height: imageObject.height }),
        ...(imageObject.license && { license: imageObject.license }),
      };
    }

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
