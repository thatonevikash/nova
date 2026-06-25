import { spawn } from "child_process";
import { resolve, isAbsolute } from "path";
import { homedir } from "os";
import { mkdirSync } from "fs";

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

// ── mkdir helper (native Node.js — works on all platforms) ───────────
// Handles "mkdir name" and "mkdir -p name".
// mkdir -p does not exist on Windows cmd.exe, so we bypass the shell.

function applyMkdir(cmd) {
  const dirArg = cmd.replace(/^mkdir(\s+-p)?\s+/, "").trim();
  const fullPath = isAbsolute(dirArg) ? dirArg : resolve(cwd, dirArg);
  mkdirSync(fullPath, { recursive: true });
  return fullPath;
}

// ── run a single shell command ────────────────────────────────────────
//
// KEY FIXES vs earlier version:
//
// 1. shell: true  — Node.js resolves the correct platform shell itself:
//      Windows → process.env.ComSpec (full path, no ENOENT)
//      Unix    → /bin/sh
//    Previously we hardcoded 'cmd.exe' which failed when it wasn't on PATH.
//
// 2. stdio: 'inherit' — all three streams (stdin/stdout/stderr) come
//    straight from the parent terminal.  create-next-app and similar tools
//    need raw TTY access for their keyboard-driven UIs (arrow keys, etc.).
//    The caller must pause() readline before calling run() so readline
//    doesn't compete for stdin — see executeCommands below.

function run(command) {
  return new Promise((res, rej) => {
    const proc = spawn(command, {
      cwd,
      shell: true, // platform shell resolved automatically
      stdio: "inherit", // full TTY passthrough for interactive prompts
    });

    proc.on("close", (code) => {
      if (code === 0 || code === null) res();
      else rej(new Error(`"${command}" exited with code ${code}`));
    });

    proc.on("error", (err) => rej(new Error(err.message)));
  });
}

// ── run all commands in sequence ──────────────────────────────────────
//
// IMPORTANT: the caller must pause() its readline interface before calling
// this function, and resume() it after.  If readline holds stdin while
// an npx command needs raw keyboard input, the prompts are unresponsive.

export async function executeCommands(commands, onCommand) {
  for (const cmd of commands) {
    if (cmd.startsWith("cd ")) {
      // Directory navigation — update internal cwd, no subprocess
      const newDir = applyCD(cmd.slice(3).trim());
      onCommand?.(`cd ${newDir}`);
    } else if (/^mkdir(\s+-p)?\s+/.test(cmd)) {
      // Directory creation via Node.js fs — cross-platform, no shell needed
      onCommand?.(cmd);
      try {
        const created = applyMkdir(cmd);
        console.log(`  Created: ${created}`);
      } catch (err) {
        throw new Error(`mkdir failed: ${err.message}`);
      }
    } else {
      // Everything else — shell with full stdio inheritance
      onCommand?.(cmd);
      console.log(); // visual space before command output
      await run(cmd);
      console.log(); // visual space after
    }
  }
}
