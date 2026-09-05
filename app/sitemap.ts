import type { MetadataRoute } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      images: [absoluteUrl(siteConfig.heroImage)],
    },
  ];
}
