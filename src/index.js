import { userInfo } from "os";
import { loadConfig, saveConfig, promptForApiKey } from "./config.js";
import { evaluateTask } from "./sdk/google-genai.js";
import { executeCommands } from "./executor.js";
import {
  printBanner,
  printCommand,
  printInfo,
  printError,
  printFinished,
  withSpinner,
  startPromptLoop,
  sep,
} from "./ui.js";

export async function activate() {
  // ── 1. API key ────────────────────────────────────────────────────
  const config = loadConfig();
  let apiKey;

  if (config?.apiKey) {
    apiKey = config.apiKey;
  } else {
    apiKey = await promptForApiKey();
    saveConfig({ apiKey });
  }

  // ── 2. Banner ─────────────────────────────────────────────────────
  const { username } = userInfo();
  printBanner(username);

  // ── 3. Main loop ──────────────────────────────────────────────────
  startPromptLoop(async (task) => {
    // Step A: evaluate the task with AI
    let plan;
    try {
      plan = await withSpinner("thinking", () => evaluateTask(apiKey, task));
    } catch (err) {
      printError(`AI error: ${err.message}`);
      return;
    }

    printInfo(plan.description);

    // Step B: execute commands
    // Output goes directly to the terminal (stdio: inherit) so interactive
    // prompts from npx, npm etc. show up and the user can answer them.
    const genStart = Date.now();

    try {
      await executeCommands(plan.commands, (cmd) => printCommand(cmd));

      const secs = ((Date.now() - genStart) / 1000).toFixed(1);
      printFinished(secs);
    } catch (err) {
      console.log();
      printError(err.message);
      sep();
    }
  });
}
