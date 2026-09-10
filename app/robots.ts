import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://aprilstore-one.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/studio', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
