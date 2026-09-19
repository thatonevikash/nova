import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../bin/nova.js", import.meta.url));
const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

function runCli(...args) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
  });
}

test("--help prints usage without starting interactive setup", () => {
  const result = runCli("--help");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: nova \[option\]/);
  assert.match(result.stdout, /--version/);
  assert.equal(result.stderr, "");
});

test("--version prints the package version", () => {
  const result = runCli("--version");

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), packageJson.version);
  assert.equal(result.stderr, "");
});

test("unsupported arguments fail with usage", () => {
  const result = runCli("--unknown");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage: nova \[option\]/);
});
