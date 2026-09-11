import Anthropic from "@anthropic-ai/sdk";

import { SYSTEM } from "./brain/anthropic.js";

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
