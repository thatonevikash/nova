#!/usr/bin/env node

const args = process.argv.slice(2);

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
} else {
  console.error("\n  Usage: nova [--dev]\n");
  process.exitCode = 1;
}
