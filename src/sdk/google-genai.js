import { GoogleGenAI, Type } from "@google/genai";

// ── system prompt ─────────────────────────────────────────────────────

const SYSTEM = `You are NOVA — a terminal AI assistant for developers.
Analyze the user's task and map it to the required structure based on the following rules.

Command rules:
- mkdir name                                  → create directory
- npx create-vite@latest app --template react → Vite scaffold
- npx create-vite@latest app --template vue   → Vite + Vue scaffold
- npx create-next-app@latest app              → Next.js scaffold
- npx create-next-mui                         → Next.js + MUI scaffold
- npm install pkg1 pkg2                       → install packages
- npm install -D pkg                          → install dev dependency
- npm uninstall pkg                           → remove package
- npm run script                              → run script
- cd dirname                                  → navigate (handled specially)

Important:
- Always add "cd <project-name>" after any npx scaffolding command.
- After scaffolding + cd, add "npm install" only if the scaffolder does not already run it.
- create-next-app handles install automatically — do NOT add "npm install" after it.
- create-vite does NOT run install — always add "npm install" after it.
- For directory creation, use mkdir -p.
- If the task is ambiguous, pick the most common/sensible interpretation.`;

// ── structured output schema ──────────────────────────────────────────

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.STRING,
      description: "What the user wants in plain language.",
    },
    category: {
      type: Type.STRING,
      enum: [
        "directory_creation",
        "npx_command",
        "package_install",
        "script_execution",
        "mixed",
      ],
      description: "The operational category of the task.",
    },
    commands: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of shell commands to execute in sequential order.",
    },
    description: {
      type: Type.STRING,
      description: "One short sentence describing what will be done.",
    },
  },
  required: ["analysis", "category", "commands", "description"],
};

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
