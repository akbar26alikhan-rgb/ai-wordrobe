
import { GoogleGenAI, Type } from "@google/genai";
import { Category, ClothingItem, WeatherInfo, CalendarEvent } from "../types";

// Always use process.env.API_KEY directly for initializing the client.

export const analyzeClothingImage = async (base64Image: string): Promise<Partial<ClothingItem>> => {
  // Use named parameter apiKey: process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = "Analyze this clothing item and provide its details in JSON format.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Category: Top, Bottom, Outerwear, Shoes, Accessory, Dress" },
          subCategory: { type: Type.STRING, description: "e.g., T-shirt, Jeans, Blazer" },
          color: { type: Type.STRING },
          style: { type: Type.STRING, description: "e.g., Casual, Formal, Streetwear" },
          season: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g., Summer, Winter" }
        },
        required: ["category", "subCategory", "color", "style", "season"]
      }
    }
  });

  try {
    // response.text is a property, not a function.
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return {};
  }
};

export const suggestOutfit = async (
  wardrobe: ClothingItem[],
  weather: WeatherInfo,
  events: CalendarEvent[]
): Promise<{ items: string[], reasoning: string }> => {
  // Use named parameter apiKey: process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const wardrobeSummary = wardrobe.map(item => ({
    id: item.id,
    category: item.category,
    subCategory: item.subCategory,
    color: item.color,
    style: item.style,
    wearCount: item.wearCount
  }));

  const prompt = `Based on the following wardrobe items, current weather, and social calendar, suggest ONE perfect outfit.
  Wardrobe: ${JSON.stringify(wardrobeSummary)}
  Weather: ${weather.temp}°C, ${weather.condition}
  Events today: ${JSON.stringify(events)}
  
  Consider:
  1. Appropriateness for events.
  2. Weather conditions.
  3. Avoid over-worn items (high wearCount).
  4. Color coordination.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of item IDs" },
          reasoning: { type: Type.STRING, description: "Why this outfit was chosen" }
        },
        required: ["items", "reasoning"]
      }
    }
  });

  try {
    // response.text is a property, not a function.
    return JSON.parse(response.text || '{"items": [], "reasoning": "Could not generate suggestion."}');
  } catch (e) {
    return { items: [], reasoning: "Styling logic failed." };
  }
};
