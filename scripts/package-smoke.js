import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const packageJson = JSON.parse(
  readFileSync(join(projectRoot, "package.json"), "utf8"),
);
const npmCli = process.env.npm_execpath;
const temporaryRoot = mkdtempSync(join(tmpdir(), "tnova-package-"));

assert(npmCli, "Run this smoke test through npm run test:package.");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    ...options,
  });

  assert.equal(
    result.status,
    0,
    `${command} ${args.join(" ")} failed:\n${result.error || result.stderr || result.stdout}`,
  );
  return result;
}

function runNpm(args) {
  return run(process.execPath, [npmCli, ...args]);
}

try {
  const packResult = runNpm([
    "pack",
    "--json",
    "--pack-destination",
    temporaryRoot,
  ]);
  const [manifest] = JSON.parse(packResult.stdout);
  const includedPaths = manifest.files.map(({ path }) => path);

  assert.equal(manifest.name, "tnova");
  assert(includedPaths.includes("bin/nova.js"));
  assert(includedPaths.includes("src/index.js"));
  assert(!includedPaths.some((path) => path.startsWith("assets/")));
  assert(!includedPaths.some((path) => path.startsWith("test/")));
  assert(!includedPaths.some((path) => path.startsWith(".github/")));
  assert(!includedPaths.some((path) => path.endsWith("AGENTS.md")));

  const installRoot = join(temporaryRoot, "install");
  mkdirSync(installRoot);
  runNpm([
    "install",
    "--prefix",
    installRoot,
    "--no-audit",
    "--no-fund",
    join(temporaryRoot, manifest.filename),
  ]);

  const executable = join(
    installRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "nova.cmd" : "nova",
  );
  assert(existsSync(executable), `npm did not create the ${executable} launcher.`);

  const installedCli = join(
    installRoot,
    "node_modules",
    packageJson.name,
    "bin",
    "nova.js",
  );
  const versionResult = run(process.execPath, [installedCli, "--version"], {
    cwd: temporaryRoot,
  });

  assert.equal(versionResult.stdout.trim(), packageJson.version);
  console.log(`Packed and installed ${manifest.name}@${manifest.version}.`);
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
