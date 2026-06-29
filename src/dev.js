import chalk from "chalk";
import { createInterface } from "readline";
import { executeCommands } from "./executor.js";
import { printCommand, printError, printFinished, sep } from "./ui.js";

// ── action definitions ────────────────────────────────────────────────
// Each entry mirrors the shape of an AI response so the real executor
// path is exercised end-to-end with no mocking.

const ACTIONS = [
  {
    id: 1,
    label: "folder creation",
    description: "Creating folder: new-folder",
    category: "directory_creation",
    commands: ["mkdir new-folder"],
  },
  {
    id: 2,
    label: "navigate within folder",
    description: "Creating open-folder and navigating inside it",
    category: "directory_creation",
    commands: ["mkdir open-folder", "cd open-folder"],
  },
  {
    id: 3,
    label: "nodejs project init",
    description: "Initialising Node.js project: server",
    category: "node_init",
    commands: ["mkdir server", "cd server", "npm init -y"],
  },
  {
    id: 4,
    label: "package installation",
    description: "Installing: dotenv, express",
    category: "package_install",
    commands: ["npm install dotenv express"],
  },
  {
    id: 5,
    label: "package uninstallation",
    description: "Removing: express",
    category: "package_install",
    commands: ["npm uninstall express"],
  },
  {
    id: 6,
    label: "react + vite setup",
    description: "Scaffolding Vite React app: todo-app",
    category: "npx_command",
    commands: [
      "npx create-vite@latest todo-app --template react",
      "cd todo-app",
      "npm install",
    ],
  },
  {
    id: 7,
    label: "nextjs setup",
    description: "Scaffolding Next.js app: next-todo-app",
    category: "npx_command",
    commands: ["npx create-next-app@latest next-todo-app"],
  },
  {
    id: 8,
    label: "nextjs + mui setup",
    description: "Scaffolding Next.js + MUI app: todo-mui",
    category: "next_mui_project",
    commands: [
      "npx create-next-mui@latest todo-mui",
      "cd todo-mui",
      "npm install",
    ],
  },
  {
    id: 9,
    label: "run dev server",
    description: "Starting dev server (npm run dev)",
    category: "script_execution",
    commands: ["npm run dev"],
  },
];

// ── helpers ───────────────────────────────────────────────────────────

const preview = (cmds) => {
  const joined = cmds.join("  →  ");
  return joined.length > 52 ? joined.slice(0, 49) + "…" : joined;
};

const pad = (str, n) => str + " ".repeat(Math.max(0, n - str.length));

// ── menu renderer ─────────────────────────────────────────────────────

function printMenu() {
  const labelWidth = Math.max(...ACTIONS.map((a) => a.label.length)) + 2;

  console.log();
  sep();
  console.log(
    `  ${chalk.white(">")} ${chalk.bold.white("NOVA")} ${chalk.gray("— development mode")}`,
  );
  sep();
  console.log();

  for (const a of ACTIONS) {
    const num = chalk.cyan(`[${a.id}]`);
    const label = chalk.white(pad(a.label, labelWidth));
    const hint = chalk.gray(preview(a.commands));
    console.log(`  ${num}  ${label}${hint}`);
  }

  console.log();
}

// ── run an action ─────────────────────────────────────────────────────

async function runAction(action) {
  console.log();
  sep();
  console.log(`  ${chalk.cyan("→")} ${chalk.gray(action.description)}`);
  console.log(`  ${chalk.gray("category:")} ${chalk.white(action.category)}`);

  const start = Date.now();

  try {
    await executeCommands(action.commands, (cmd) => printCommand(cmd));

    const secs = ((Date.now() - start) / 1000).toFixed(1);
    printFinished(secs);
  } catch (err) {
    console.log();
    printError(err.message);
    sep();
  }
}

// ── prompt loop ───────────────────────────────────────────────────────

export async function devMode() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  rl.on("SIGINT", () => {
    console.log(
      `\n\n  ${chalk.gray(">")} ${chalk.gray("Exiting dev mode.")}\n`,
    );
    process.exit(0);
  });

  const ask = () => {
    printMenu();

    rl.question(
      `  ${chalk.white(">")} ${chalk.gray("pick action [1-9] or exit: ")}`,
      async (raw) => {
        const input = raw.trim().toLowerCase();

        if (!input) {
          ask();
          return;
        }

        if (input === "exit" || input === "quit") {
          console.log(
            `\n  ${chalk.gray(">")} ${chalk.gray("Exiting dev mode.")}\n`,
          );
          rl.close();
          process.exit(0);
        }

        const num = parseInt(input, 10);
        const action = ACTIONS.find((a) => a.id === num);

        if (!action) {
          console.log(
            `\n  ${chalk.red("✗")} ${chalk.red(`"${input}" is not valid — enter 1–9 or exit.`)}`,
          );
          ask();
          return;
        }

        // ── hand stdin back to the child process ──────────────────────
        // readline holds process.stdin and keeps it in line-buffered mode.
        // Interactive tools like create-next-app need raw TTY access for
        // arrow keys and keyboard navigation.  pause() releases that hold
        // so the spawned process gets full control of the terminal.
        rl.pause();

        await runAction(action);

        // ── reclaim stdin for the next menu prompt ────────────────────
        rl.resume();
        ask();
      },
    );
  };

  ask();
}
