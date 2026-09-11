import chalk from "chalk";
import * as prompts from "@clack/prompts";
import { executeCommands } from "../src/executor.js";
import { printCommand, printError, printFinished } from "../src/ui.js";

// Each entry mirrors the shape of an AI response so the real executor path is
// exercised end-to-end with no mocking.
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

const preview = (commands) => {
  const joined = commands.join("  ->  ");
  return joined.length > 52 ? `${joined.slice(0, 49)}...` : joined;
};

async function runAction(action) {
  prompts.log.info(action.description);
  prompts.log.message(
    `${chalk.dim("Category:")} ${chalk.white(action.category)}`,
  );

  const start = Date.now();

  try {
    await executeCommands(action.commands, (command) => printCommand(command));
    const seconds = ((Date.now() - start) / 1000).toFixed(1);
    printFinished(seconds);
  } catch (error) {
    printError(error.message);
  }
}

export async function devMode() {
  prompts.intro(`${chalk.bold.white("NOVA")} ${chalk.dim("Development mode")}`);

  while (true) {
    const selected = await prompts.select({
      message: "Choose a safe development action",
      options: [
        ...ACTIONS.map((action) => ({
          value: action.id,
          label: action.label,
          hint: preview(action.commands),
        })),
        { value: "exit", label: "Exit development mode" },
      ],
      maxItems: 10,
    });

    if (prompts.isCancel(selected) || selected === "exit") {
      prompts.outro("Exiting development mode.");
      return;
    }

    const action = ACTIONS.find(({ id }) => id === selected);
    if (!action) {
      printError("The selected development action is unavailable.");
      continue;
    }

    // The select prompt has completed, so the child receives the terminal
    // directly through the executor's inherited stdio.
    await runAction(action);
  }
}
