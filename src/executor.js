import { spawn } from "child_process";
import { resolve, isAbsolute } from "path";
import { homedir } from "os";
import { mkdirSync } from "fs";

// ── platform detection ────────────────────────────────────────────────

const IS_WINDOWS = process.platform === "win32";

// Windows → cmd.exe /c   |   Unix → sh -c
const SHELL = IS_WINDOWS ? "cmd.exe" : "sh";
const SHELL_FLAG = IS_WINDOWS ? "/c" : "-c";

// ── state ─────────────────────────────────────────────────────────────

let cwd = process.cwd();

export const getCurrentDir = () => cwd;

// ── cd helper (no subprocess — just updates state) ────────────────────

function applyCD(target) {
  const expanded = target.startsWith("~")
    ? target.replace("~", homedir())
    : target;

  cwd = isAbsolute(expanded) ? expanded : resolve(cwd, expanded);
  return cwd;
}

// ── mkdir helper (native Node.js — no shell needed) ───────────────────
// Handles both "mkdir dirname" and "mkdir -p dirname" on any OS.

function applyMkdir(cmd) {
  const dirArg = cmd.replace(/^mkdir(\s+-p)?\s+/, "").trim();
  const fullPath = isAbsolute(dirArg) ? dirArg : resolve(cwd, dirArg);
  mkdirSync(fullPath, { recursive: true });
  return fullPath;
}

// ── run a single shell command ────────────────────────────────────────
// All three stdio streams are inherited so:
//   • interactive prompts (npx create-*, y/n questions) show in the terminal
//   • the user can answer them normally
//   • colors and progress bars from the child process render correctly
//
// Trade-off: we don't capture output for indented formatting,
// but commands actually work — which matters more.

function run(command) {
  return new Promise((res, rej) => {
    const proc = spawn(SHELL, [SHELL_FLAG, command], {
      cwd,
      stdio: "inherit",
    });

    proc.on("close", (code) => {
      if (code === 0 || code === null) res();
      else rej(new Error(`"${command}" exited with code ${code}`));
    });

    proc.on("error", (err) => rej(new Error(err.message)));
  });
}

// ── run all commands in sequence ──────────────────────────────────────

export async function executeCommands(commands, onCommand) {
  for (const cmd of commands) {
    if (cmd.startsWith("cd ")) {
      // Directory navigation — update internal state, no subprocess
      const newDir = applyCD(cmd.slice(3).trim());
      onCommand?.(`cd ${newDir}`);
    } else if (/^mkdir(\s+-p)?\s+/.test(cmd)) {
      // Directory creation — Node.js fs handles this cross-platform
      // (mkdir -p doesn't exist on Windows cmd.exe)
      onCommand?.(cmd);
      try {
        const created = applyMkdir(cmd);
        console.log(`  Created: ${created}`);
      } catch (err) {
        throw new Error(`mkdir failed: ${err.message}`);
      }
    } else {
      // Everything else — hand off to the platform shell with full stdio
      onCommand?.(cmd);
      console.log(); // breathing room before raw command output
      await run(cmd);
      console.log(); // breathing room after
    }
  }
}
