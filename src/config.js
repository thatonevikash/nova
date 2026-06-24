import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { createInterface } from "readline";
import chalk from "chalk";

const CONFIG_DIR = join(homedir(), ".nova");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

// ── read ─────────────────────────────────────────────────────────────

export function loadConfig() {
  try {
    if (!existsSync(CONFIG_FILE)) return null;
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return null;
  }
}

// ── write ────────────────────────────────────────────────────────────

export function saveConfig(data) {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ── first-time setup ─────────────────────────────────────────────────

export async function promptForApiKey() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  console.log();
  console.log(chalk.gray("  ──────────────────────────────────────"));
  console.log(
    `  ${chalk.bold.white("NOVA")} ${chalk.gray("— first time setup")}`,
  );
  console.log(
    chalk.gray("  Your key will be stored at ") +
      chalk.cyan("~/.nova/config.json"),
  );
  console.log(chalk.gray("  ──────────────────────────────────────"));
  console.log();

  return new Promise((resolve) => {
    rl.question(`  ${chalk.gray("GenAI API key ›")} `, (input) => {
      rl.close();
      const key = input.trim();
      if (!key) {
        console.log(chalk.red("\n  ✗ No key entered. Exiting.\n"));
        process.exit(1);
      }
      console.log(chalk.green("\n  ✓ Key saved.\n"));
      resolve(key);
    });
  });
}
