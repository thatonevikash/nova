import chalk from "chalk";
import { createInterface } from "readline";

// ── primitives ────────────────────────────────────────────────────────

export const sep = () => console.log(chalk.gray("  -"));

export const printBanner = (username) => {
  console.log();
  sep();
  console.log(
    `  ${chalk.white(">")} Hello, ${chalk.cyan(username)}. I'm ${chalk.bold.white("'NOVA'")}`,
  );
  sep();
};

export const printCommand = (cmd) =>
  console.log(`  ${chalk.green("$")} ${chalk.white(cmd)}`);

export const printInfo = (text) =>
  console.log(`  ${chalk.cyan("→")} ${chalk.gray(text)}`);

export const printError = (text) =>
  console.log(`  ${chalk.red("✗")} ${chalk.red(text)}`);

export const printOutput = (line, stream) => {
  const color = stream === "err" ? chalk.yellow : chalk.gray;
  console.log(`  ${color(line)}`);
};

export const printFinished = (elapsedSeconds) => {
  sep();
  if (elapsedSeconds !== undefined) {
    console.log(
      `  ${chalk.gray("◕")} ${chalk.gray(`generating... ( ${elapsedSeconds} seconds )`)}`,
    );
  }
  console.log(`  ${chalk.green("◓")} ${chalk.gray("finished.")}`);
  sep();
};

// ── spinner (for async ops with no stdout — e.g. AI call) ────────────

const FRAMES = ["◕", "◔", "◑", "◒"];

export async function withSpinner(label, fn) {
  const start = Date.now();
  let i = 0;

  const tick = () =>
    process.stdout.write(
      `\r  ${chalk.gray(FRAMES[i++ % FRAMES.length])} ${chalk.gray(label + "...")}    `,
    );

  tick();
  const timer = setInterval(tick, 120);

  try {
    const result = await fn();
    clearInterval(timer);
    const secs = ((Date.now() - start) / 1000).toFixed(1);
    process.stdout.write(
      `\r  ${chalk.gray("◕")} ${chalk.gray(`${label}... ( ${secs} seconds )`)}\n`,
    );
    return result;
  } catch (err) {
    clearInterval(timer);
    process.stdout.write("\n");
    throw err;
  }
}

// ── prompt loop ───────────────────────────────────────────────────────

export function startPromptLoop(onTask) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  // Ctrl-C graceful exit
  rl.on("SIGINT", () => {
    console.log(`\n\n  ${chalk.gray(">")} ${chalk.gray("Goodbye.")}\n`);
    process.exit(0);
  });

  const ask = () => {
    console.log();
    rl.question(
      `  ${chalk.white(">")} ${chalk.gray("describe your task! ")}`,
      async (raw) => {
        const task = raw.trim();

        if (!task) {
          ask();
          return;
        }

        if (["exit", "quit", "bye"].includes(task.toLowerCase())) {
          console.log(`\n  ${chalk.gray(">")} ${chalk.gray("Goodbye.")}\n`);
          rl.close();
          process.exit(0);
        }

        console.log();
        sep();
        rl.pause(); // release stdin before any command runs
        await onTask(task);
        rl.resume(); // reclaim stdin for the next prompt
        ask();
      },
    );
  };

  ask();
}
