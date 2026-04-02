# AGENTS.md

This repository is kept intentionally small and focused. Use these rules when making changes:

## Purpose

- Build a timestamp-copy utility with two clients: a Manifest V3 browser extension and a lightweight Windows app.
- Keep the shared time-formatting logic in TypeScript so both clients behave the same way.
- The single user action is: generate the current time in `h:mm:ssAM/PM` format and copy it to the clipboard.

## Working Rules

- Prefer small, reversible changes.
- Keep business logic in shared modules before duplicating code in app-specific layers.
- Match existing structure and naming instead of introducing new patterns without a strong reason.
- Favor simple dependencies and lightweight UI.
- Document any new commands, environment needs, or architectural decisions in `README.md`.

## Quality Bar

- Make user-facing behavior explicit and predictable.
- Preserve the exact timestamp format unless the task clearly asks to change it.
- Add or update tests when shared formatting logic changes.
- Avoid unrelated refactors while working on a focused task.

## Repo Notes

- `packages/core` is for shared TypeScript logic.
- `apps/extension` is for the browser extension.
- `apps/windows` is for the Windows background app shell.
