import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI correctly with apiKey from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhancePostContent = async (currentContent: string, goal: 'professional' | 'viral' | 'fix_grammar'): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    return currentContent; // Fallback
  }

  const prompts = {
    professional: "Rewrite the following LinkedIn post to be more professional, concise, and impactful. Maintain the original meaning but improve the tone.",
    viral: "Rewrite the following LinkedIn post to be more engaging and 'viral'. Use a strong hook, short paragraphs for readability, and a call to action.",
    fix_grammar: "Correct any grammar or spelling errors in the following text. Do not change the tone or style significantly."
  };

  try {
    // Fix: Use 'gemini-3-flash-preview' for text processing tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${prompts[goal]}:\n\n"${currentContent}"`
    });

    return response.text?.trim() || currentContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};