
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getProductAdvice(prompt: string, products: Product[]) {
  const productsSummary = products.map(p => 
    `${p.name} (سعر: ${p.price}, جملة: ${p.wholesalePrice}, متاح: ${p.quantity} ${p.unitType})`
  ).join(', ');

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `أنت مساعد ذكي لمتجر "عالم بلاستك" في الكوت. ساعد الزبون بناءً على المنتجات المتوفرة: ${productsSummary}. الطلب: ${prompt}`,
    config: {
      systemInstruction: "أنت خبير في المنتجات البلاستيكية وتجارة الجملة في العراق. تحدث بلهجة عراقية محببة ومهنية. ركز على فوائد الشراء بالجملة وخدمة التوصيل المجاني في الكوت.",
      temperature: 0.7,
    }
  });

  return response.text;
}
