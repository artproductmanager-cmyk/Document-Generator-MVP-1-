import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export function SEO({ title, description, keywords, ogTitle, ogDescription }: SEOProps) {
  useEffect(() => {
    // Устанавливаем title
    document.title = title;

    // Устанавливаем мета-теги
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      } else {
        const meta = document.createElement("meta");
        meta.name = "keywords";
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }

    // Open Graph для социальных сетей
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute("content", ogTitle || title);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      meta.content = ogTitle || title;
      document.head.appendChild(meta);
    }

    const ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) {
      ogDescMeta.setAttribute("content", ogDescription || description);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:description");
      meta.content = ogDescription || description;
      document.head.appendChild(meta);
    }
  }, [title, description, keywords, ogTitle, ogDescription]);

  return null;
}
