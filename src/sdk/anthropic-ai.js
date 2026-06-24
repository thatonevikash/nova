import Anthropic from "@anthropic-ai/sdk";

// ── system prompt ─────────────────────────────────────────────────────

const SYSTEM = `You are NOVA — a terminal AI assistant for developers.
Analyze the user's task and respond ONLY with a raw JSON object. No markdown, no prose, no backticks.

Schema:
{
  "analysis": "what the user wants in plain language",
  "category": "directory_creation" | "npx_command" | "package_install" | "script_execution" | "mixed",
  "commands": ["shell command 1", "shell command 2"],
  "description": "one short sentence describing what will be done"
}

Command rules:
- mkdir -p name                               → create directory
- npx create-vite@latest app --template react → Vite scaffold
- npx create-vite@latest app --template vue   → Vite + Vue scaffold
- npx create-next-app@latest app              → Next.js scaffold
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

// ── evaluate ──────────────────────────────────────────────────────────

export async function evaluateTask(apiKey, task) {
  const client = new Anthropic({ apiKey });

  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: SYSTEM,
    messages: [{ role: "user", content: task }],
  });

  const raw = msg.content[0].text
    .trim()
    .replace(/^```json\s*|\s*```$/g, "")
    .trim();

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Could not parse AI response: ${raw.slice(0, 120)}`);
  }
}
