import test from "node:test";
import assert from "node:assert/strict";

import { evaluateTask as evaluateWithAnthropic } from "../src/sdk/anthropic-ai.js";
import { evaluateTask as evaluateWithGoogle } from "../src/sdk/google-genai.js";

test("provider adapters load without making API requests", () => {
  assert.equal(typeof evaluateWithAnthropic, "function");
  assert.equal(typeof evaluateWithGoogle, "function");
});
