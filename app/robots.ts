// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aprilstore-one.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/dashboard/*', '/studio', '/studio/*', '/api/*'],
      },
      // Search Engine Crawlers
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
          'Applebot',
        ],
        allow: '/',
        disallow: ['/dashboard', '/studio', '/api/*'],
      },
      // AI Crawlers & LLM Indexers (ChatGPT, Perplexity, Claude, Gemini, Cohere, etc.)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'CCBot',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/dashboard', '/studio', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
