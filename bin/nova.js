#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes("--activate")) {
  const { activate } = await import("../src/index.js");
  await activate().catch((err) => {
    console.error("\n  ✗ " + err.message + "\n");
    process.exit(1);
  });
} else if (args.includes("--development")) {
  const { devMode } = await import("../src/dev.js");
  await devMode().catch((err) => {
    console.error("\n  ✗ " + err.message + "\n");
    process.exit(1);
  });
} else {
  console.log("\n  Usage:");
  console.log("    nova --activate       start NOVA");
  console.log("    nova --development    test actions locally\n");
  process.exit(0);
}
