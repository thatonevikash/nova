# Nova contributor guidance

## Project overview

Nova is a local terminal AI assistant. It accepts a natural-language task, asks
an AI provider for a structured plan, displays the plan, and executes the
provider-returned command strings sequentially in the user's shell.

The project uses Node.js 18 or newer and ECMAScript modules. Keep JavaScript
imports explicit with `.js` extensions.

Important entry points:

- `bin/nova.js` dispatches the normal CLI and `nova --dev`.
- `src/index.js` coordinates configuration, model evaluation, UI, and execution.
- `src/sdk/` contains provider adapters and provider-specific brain prompts.
- `src/executor.js` owns working-directory state and command execution.
- `.development/index.js` is the interactive development action menu.

## Change principles

- Keep runtime behavior consistent on Windows, macOS, and Linux. Prefer Node.js
  APIs over platform-specific shell syntax when Node can perform the operation.
- Preserve the existing CLI and configuration interfaces unless the task
  explicitly changes them.
- Never log, commit, snapshot, or include API keys in errors. Treat
  `~/.nova/config.json` and all provider credentials as secrets.
- Keep provider-specific behavior aligned. A supported task must produce the
  same operational meaning regardless of the selected model provider.
- Update user documentation when commands, setup, configuration, or supported
  task categories change.

## Command safety

Treat model responses, command arguments, file paths, and user input as
untrusted data. Nova's target design is a strict allowlist: every executable
operation must have a known category, validated arguments, and an explicit
executor implementation. Adding a command family requires updating the plan
contract, validation, executor handling, provider prompts, examples, and tests
together.

Do not add or extend a generic shell-command escape hatch. The current fallback
in `src/executor.js`, which sends every otherwise-unmatched model command to a
shell, is known technical debt and must not be described as safe. When touching
that path, move it toward validated allowlisted operations. Destructive,
privileged, networked, or long-running operations require explicit handling and
a clear user confirmation policy.

## Verification

There is currently no repository-level `npm test` script. For documentation-only
changes, inspect the rendered Markdown, verify paths and commands against the
repository, and review `git diff --check` plus `git diff`.

For behavior changes:

- Add deterministic automated coverage, preferably with Node's built-in test
  runner, and expose a stable package script when introducing the test suite.
- Run syntax checks on each changed JavaScript entry point with
  `node --check <file>`.
- Exercise `node bin/nova.js --dev` manually when executor, terminal UI, or TTY
  behavior changes. Use only safe actions in a disposable directory.
- Check prompt input, sequential commands, directory changes, child-process
  failures, TTY handoff, and interruption with `Ctrl+C` where relevant.
- Do not use live provider calls as the only automated verification. Test plan
  parsing and validation with fixed fixtures.

Nested `AGENTS.md` files add subsystem-specific requirements. Follow both this
file and the nearest nested file; the more specific guidance wins only when it
does not weaken these safety rules.
