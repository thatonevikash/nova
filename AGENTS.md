# Git Instructions

## Branches

- Create feature branches from the current branch unless instructed otherwise.
- Use descriptive branch names.

Examples:

feature/add-command-palette
fix/quiz-navigation
refactor/sidebar-tree

---

## Commits

Use Conventional Commits.

Format:

<type>(optional-scope): <summary>

Examples:

feat(editor): add slash command menu
fix(router): preserve search params
refactor(store): simplify navigation state
docs(api): update usage examples
test(search): add keyboard navigation tests
chore(deps): update dependencies

Rules:

- Keep the summary under 72 characters.
- Use the imperative mood (e.g., "add", "fix", "remove").
- Make each commit represent a single logical change.
- Avoid "WIP", "misc", "update", or "fix stuff".

---

## Commit Body

When needed, explain:

- Why the change was made.
- Any important implementation details.
- Side effects or migration notes.

---

## Pull Requests

Use this template:

## Summary

Brief description of the change.

## Motivation

Why this change is needed.

## Changes

- Main change 1
- Main change 2
- Main change 3

## Testing

- [ ] Unit tests
- [ ] Manual testing
- [ ] Build passes

## Breaking Changes

None

---

## Before Committing

- Run the project's formatter.
- Run linting if configured.
- Ensure the project builds successfully.
- Do not commit generated files unless required.

---

## Before Opening a PR

- Squash or organize commits if appropriate.
- Ensure each commit is meaningful.
- Keep the PR focused on a single feature or fix.
- Avoid unrelated formatting changes.

---

## General Rules

- Prefer multiple small commits over one large commit.
- Never rewrite Git history unless explicitly instructed.
- Never force-push without explicit permission.
- Do not commit secrets, credentials, or environment files.
