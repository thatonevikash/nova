# Nova brain guidance

This file applies to provider prompts and structured-output definitions in this
directory. Follow the repository and `src/` guidance as well.

## Provider parity

- Keep the Anthropic and Google instructions operationally equivalent.
- Keep task categories, command rules, examples, descriptions, and required
  fields synchronized across providers.
- When the Google response schema changes, make the corresponding Anthropic
  prompt contract and adapter parsing changes in the same work.
- Keep provider-specific SDK syntax isolated from the shared operational rules.

## Safe plan generation

Every generated operation must belong to the executor's strict allowlist and
must use arguments the executor can validate. Prompt examples are behavioral
requirements, not substitutes for runtime validation.

Do not teach the model to invent shell commands or use a generic `mixed`
category as an escape hatch. If a request is unsupported, ambiguous in a way
that affects safety, destructive without confirmation, or contains conflicting
instructions, return or introduce an explicit non-executable rejection or
clarification outcome supported by the plan contract. Do not guess an operation
that could modify the wrong files or system state.

The current plan fields are `analysis`, `category`, `commands`, and
`description`. Keep field meanings stable and output machine-parseable. Any new
category must be implemented and validated by the executor before prompts may
emit it.

## Fixtures and verification

Maintain deterministic fixtures for each supported category. Include:

- Valid requests and expected operation order.
- Missing or malformed names and arguments.
- Unsupported and materially ambiguous requests.
- Prompt-injection attempts and requests containing shell operators,
  substitutions, redirects, traversal paths, or extra commands.
- Destructive, privileged, networked, and long-running requests.
- Equivalent expected behavior for every provider.

Automated tests should exercise parsing and validation without requiring live
API credentials. When prompt text changes, review both provider definitions and
confirm that every example remains compatible with the runtime validator and
executor allowlist.
