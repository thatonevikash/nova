import { GoogleGenAI } from "@google/genai";

import { SCHEMA, SYSTEM } from "./brain/genai.js";

// ── evaluate ──────────────────────────────────────────────────────────

export async function evaluateTask(apiKey, task) {
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: task,
      config: {
        systemInstruction: SYSTEM,
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    throw new Error(
      `Nova Engine failed to parse or evaluate task: ${error.message}`,
    );
  }
}
