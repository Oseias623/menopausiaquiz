
import { GoogleGenAI, Type } from "@google/genai";
import { LandingPageContent } from "../types";

export const generateLandingPageContent = async (businessIdea: string, niche: string): Promise<LandingPageContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Crie o conteúdo de uma Landing Page com a estrutura exata do estilo "Las Cartas de Pablo" para: "${businessIdea}" no nicho "${niche}".
    
    ESTRUTURA OBRIGATÓRIA:
    1. HERO (Dobra 1): Headline empática (max 12 palavras) e Subheadline acolhedora. SEM botão de CTA aqui.
    2. DOBRA DE DOR (Problem Statement): Título que espelha o sentimento do usuário + 4 perguntas/afirmações curtas que geram identificação imediata (serão usadas com X vermelho).
    3. DOBRA DE ALÍVIO (Features): 3 pontos principais de como o guia ajuda na vida real (serão usados com Check verde).
    4. TOM DE VOZ: Anti-marketing agressivo, sem promessas milagrosas, focado em "você não está sozinha" e "não é sua culpa".
    
    Idioma: Português do Brasil. Formato: JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          businessName: { type: Type.STRING },
          headline: { type: Type.STRING },
          subheadline: { type: Type.STRING },
          problemStatement: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              questions: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING }
            },
            required: ["title", "questions", "summary"]
          },
          heroImage: { type: Type.STRING },
          features: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                icon: { type: Type.STRING }
              },
              required: ["id", "title", "description", "icon"]
            }
          },
          pricing: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                cta: { type: Type.STRING },
                highlighted: { type: Type.BOOLEAN }
              },
              required: ["name", "price", "features", "cta", "highlighted"]
            }
          },
          testimonials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                author: { type: Type.STRING },
                role: { type: Type.STRING },
                content: { type: Type.STRING },
                avatar: { type: Type.STRING }
              },
              required: ["author", "role", "content", "avatar"]
            }
          },
          ctaText: { type: Type.STRING }
        },
        required: ["businessName", "headline", "subheadline", "problemStatement", "heroImage", "features", "pricing", "testimonials", "ctaText"]
      }
    }
  });

  return JSON.parse(response.text);
};
