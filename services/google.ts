import { GoogleGenAI } from "@google/genai";
import type { AIServices, ChatMessages } from "../types";

// client may pick up credentials from environment (GOOGLE_API_KEY etc.)
const ai = new GoogleGenAI({});

export const googleService: AIServices = {
  name: "Google",
  async chat(messages: ChatMessages[]) {
    try {
      const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      const text = response.text || "";
      return (async function* () {
        yield text;
      })();
    } catch (err) {
      console.error("Google service error", err);
      const message = (err && (err as any).message) || String(err);
      return (async function* () {
        yield `Google error: ${message}`;
      })();
    }
  },
};
