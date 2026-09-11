import * as prompts from "@clack/prompts";
import chalk from "chalk";

const EXIT_COMMANDS = new Set(["exit", "quit", "bye"]);

export const printBanner = (username) => {
  prompts.intro(
    `${chalk.dim(`I'm`)} ${chalk.bold.white("NOVA")} ${chalk.dim(`- Hello, ${username}`)}`,
  );
};

export const printCommand = (command) =>
  prompts.log.step(`${chalk.green("$")} ${chalk.white(command)}`);

export const printInfo = (message) => prompts.log.info(message);

export const printError = (message) => prompts.log.error(message);

export const printOutput = (line, stream) => {
  const color = stream === "err" ? chalk.yellow : chalk.dim;
  prompts.log.message(color(line));
};

export const printFinished = (elapsedSeconds) => {
  const duration =
    elapsedSeconds === undefined ? "" : ` in ${elapsedSeconds} seconds`;
  prompts.log.success(`Finished${duration}.`);
};

export const printSetupComplete = () => prompts.outro("API key saved.");

export async function withSpinner(
  label,
  operation,
  createSpinner = prompts.spinner,
) {
  const indicator = createSpinner();
  const start = Date.now();

  indicator.start(`${label}...`);

  try {
    const result = await operation();
    const seconds = ((Date.now() - start) / 1000).toFixed(1);
    indicator.stop(`${label} complete (${seconds}s).`);
    return result;
  } catch (error) {
    indicator.error(`${label} failed.`);
    throw error;
  }
}

export async function startPromptLoop(onTask, promptApi = prompts) {
  while (true) {
    const answer = await promptApi.text({
      message: "What would you like Nova to do?",
      placeholder: "Create a React app with authentication",
      validate(value) {
        if (!value?.trim()) return "Please describe a task.";
      },
    });

    if (promptApi.isCancel(answer)) {
      promptApi.cancel("Goodbye.");
      return;
    }

    const task = answer.trim();

    if (EXIT_COMMANDS.has(task.toLowerCase())) {
      promptApi.outro("Goodbye.");
      return;
    }

    // A Clack prompt releases stdin after it resolves. Interactive child
    // processes can therefore inherit the terminal without competing with
    // a persistent readline interface.
    await onTask(task);
  }
}
