import test from "node:test";
import assert from "node:assert/strict";
import { startPromptLoop, withSpinner } from "../src/ui.js";

function createPromptApi(answers, cancelValue = Symbol("cancel")) {
  const events = [];
  const configurations = [];

  return {
    events,
    configurations,
    async text(configuration) {
      configurations.push(configuration);
      return answers.shift();
    },
    isCancel(value) {
      return value === cancelValue;
    },
    cancel(message) {
      events.push(["cancel", message]);
    },
    outro(message) {
      events.push(["outro", message]);
    },
  };
}

test("prompt loop runs trimmed tasks until an exit command", async () => {
  const promptApi = createPromptApi(["  create an app  ", "QUIT"]);
  const tasks = [];

  await startPromptLoop(async (task) => tasks.push(task), promptApi);

  assert.deepEqual(tasks, ["create an app"]);
  assert.deepEqual(promptApi.events, [["outro", "Goodbye."]]);
  assert.equal(
    promptApi.configurations[0].validate("  "),
    "Please describe a task.",
  );
  assert.equal(promptApi.configurations[0].validate("valid task"), undefined);
});

test("prompt loop handles Ctrl+C cancellation without running a task", async () => {
  const cancelValue = Symbol("cancel");
  const promptApi = createPromptApi([cancelValue], cancelValue);
  let taskCount = 0;

  await startPromptLoop(async () => taskCount++, promptApi);

  assert.equal(taskCount, 0);
  assert.deepEqual(promptApi.events, [["cancel", "Goodbye."]]);
});

test("spinner reports success and returns the operation result", async () => {
  const events = [];
  const createSpinner = () => ({
    start: (message) => events.push(["start", message]),
    stop: (message) => events.push(["stop", message]),
    error: (message) => events.push(["error", message]),
  });

  const result = await withSpinner("Thinking", async () => 42, createSpinner);

  assert.equal(result, 42);
  assert.deepEqual(events[0], ["start", "Thinking..."]);
  assert.match(events[1][1], /^Thinking complete \(\d+\.\d+s\)\.$/);
});

test("spinner stops with an error and preserves the original failure", async () => {
  const events = [];
  const failure = new Error("provider unavailable");
  const createSpinner = () => ({
    start: (message) => events.push(["start", message]),
    stop: (message) => events.push(["stop", message]),
    error: (message) => events.push(["error", message]),
  });

  await assert.rejects(
    withSpinner(
      "Thinking",
      async () => {
        throw failure;
      },
      createSpinner,
    ),
    (error) => error === failure,
  );

  assert.deepEqual(events.at(-1), ["error", "Thinking failed."]);
});
