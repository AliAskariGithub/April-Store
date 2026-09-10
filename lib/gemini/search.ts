// lib/gemini/search.ts
import { getGeminiClient } from './client';
import { Product } from '@/types/product';
import { Type } from '@google/genai';

export interface SmartSearchResult {
  productIds: string[];
  intent: string;
}

export async function performSmartSearch(query: string, products: Product[]): Promise<SmartSearchResult> {
  const simplifiedCatalog = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    price: p.price,
    salePrice: p.salePrice,
    colors: p.colors,
    sizes: p.sizes,
    tags: p.tags,
    description: p.description,
  }));

  try {
    const ai = getGeminiClient();
    const prompt = `You are a fashion search assistant for April Store, a luxury apparel brand.
Given a user's search query, analyze it and return a JSON object with matching product IDs ranked by relevance and a brief user intent summary.
Consider: category, color, price range in PKR, occasion (weddings, galas, casual luxury, evening), fabric (silk, velvet, organza, linen, cashmere), and style keywords.

Available catalog:
${JSON.stringify(simplifiedCatalog, null, 2)}

User search query: "${query}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are the April Store luxury search intelligence engine. Always match relevant fashion products accurately based on fabrics, colors, occasions, and budget.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of product IDs matching the query ranked by relevance',
            },
            intent: {
              type: Type.STRING,
              description: 'Brief summary of what the customer is looking for',
            },
          },
          required: ['productIds', 'intent'],
        },
      },
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text) as SmartSearchResult;
      return parsed;
    }
  } catch (error) {
    console.error('Smart search with Gemini failed, falling back to keyword search:', error);
  }

  // Fallback keyword matcher if Gemini API key isn't available
  const lower = query.toLowerCase();
  const matched = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.toLowerCase().includes(lower)) ||
      p.colors?.some((c) => c.toLowerCase().includes(lower))
    );
  });

  return {
    productIds: matched.map((p) => p.id),
    intent: `Keyword matching for "${query}"`,
  };
}
