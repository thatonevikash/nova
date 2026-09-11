import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import * as prompts from "@clack/prompts";
import chalk from "chalk";

const CONFIG_DIR = join(homedir(), ".nova");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export function loadConfig() {
  try {
    if (!existsSync(CONFIG_FILE)) return null;
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return null;
  }
}

export function saveConfig(data) {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function promptForApiKey() {
  prompts.intro(`${chalk.bold.white("NOVA")} ${chalk.dim("First-time setup")}`);
  prompts.note(
    `Your key will be stored at ${chalk.cyan("~/.nova/config.json")}.`,
    "Configuration",
  );

  const key = await prompts.password({
    message: "Enter your Google GenAI API key",
    validate(value) {
      if (!value?.trim()) return "An API key is required.";
    },
  });

  if (prompts.isCancel(key)) {
    prompts.cancel("Setup cancelled.");
    return null;
  }

  return key.trim();
}
