import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Missing API_KEY environment variable for Gemini.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateLessonSummary = async (lessonTitle: string, lessonDescription: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable (Check API Key).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a concise 3-bullet point summary of what a student might expect to learn from a lesson titled "${lessonTitle}" with the description: "${lessonDescription}". Keep it encouraging.`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary. Please try again later.";
  }
};

export const askAITutor = async (question: string, context: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Service Unavailable.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: You are a helpful, friendly AI tutor on the Smartlearn platform. The student is currently watching a lesson about: ${context}.
      
      Student Question: ${question}
      
      Answer concisely and clearly. If the question is off-topic, politely guide them back to learning.`,
    });
    return response.text || "I couldn't understand that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "My brain is having a hiccup. Try again?";
  }
};