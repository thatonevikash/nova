# Nova runtime guidance

This file applies to runtime code under `src/`. Follow the repository-level
`AGENTS.md` as well.

## Runtime invariants

- Keep command execution sequential. A later operation may depend on the
  working directory or filesystem state produced by an earlier one.
- Preserve working-directory state inside Nova; do not assume that a spawned
  child's `cd` changes the parent process.
- Preserve full terminal passthrough for genuinely interactive child processes.
  Coordinate readline pause/resume behavior so Nova and a child never compete
  for stdin.
- Keep errors concise and actionable. Include the failed operation and exit
  status when useful, but never include API keys, full provider payloads, or
  other credentials.
- Keep filesystem and process behavior portable across Windows, macOS, and
  Linux. Resolve and validate paths before using them.

## Execution boundary

Never pass raw or merely schema-shaped model output directly to a shell. A
structured response is not validation. Before execution, confirm that the
category is supported, the operation matches that category, every argument has
an allowed form, and paths remain within the scope authorized by the user.

Implement command families as explicit operations with validated arguments.
Prefer `spawn` with an executable and argument array, without `shell: true`, and
prefer Node.js filesystem APIs for directory and file operations. If a shell is
unavoidable, document why and reject shell operators, substitutions, redirects,
and additional commands that are not part of the allowlisted operation.

Destructive, privileged, networked, and long-running operations must be modeled
explicitly. Define confirmation, cancellation, timeout, exit-code, and partial
failure behavior before enabling them. Never silently broaden a category to
cover arbitrary shell commands.

## Plan contract and tests

The current provider plan contains:

- `analysis`: plain-language interpretation of the request.
- `category`: one supported operational category.
- `commands`: ordered command strings in the current interface.
- `description`: a short user-facing summary.

Treat this shape as an external boundary between the provider and runtime.
Validate it before execution, and update every provider plus tests if it changes.
For executor changes, cover accepted operations, rejected commands, malformed
arguments, path traversal or unsafe path input, sequencing, directory state,
non-zero exits, and cancellation. Manually verify interactive TTY handoff and
`Ctrl+C` behavior when those paths change.
