#!/usr/bin/env node

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const usage = `
  Usage: nova [option]

  Options:
    -h, --help       Show this help message
    -v, --version    Show the installed version
    --dev            Launch the development action menu
`;

const reportError = (err) => {
  console.error("\n  ✗ " + err.message + "\n");
  process.exitCode = 1;
};

if (args.length === 0) {
  const { activate } = await import("../src/index.js");
  await activate().catch(reportError);
} else if (args.length === 1 && args[0] === "--dev") {
  const { devMode } = await import("../.development/index.js");
  await devMode().catch(reportError);
} else if (args.length === 1 && ["-h", "--help"].includes(args[0])) {
  console.log(usage);
} else if (args.length === 1 && ["-v", "--version"].includes(args[0])) {
  console.log(version);
} else {
  console.error(usage);
  process.exitCode = 1;
}
