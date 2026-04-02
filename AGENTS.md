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
- Treat the extension and Windows app as security-sensitive local utilities: least privilege first, no remote code, no telemetry by default, and no unnecessary permissions.

## Quality Bar

- Make user-facing behavior explicit and predictable.
- Preserve the exact timestamp format unless the task clearly asks to change it.
- Add or update tests when shared formatting logic changes.
- Target at least 80% line coverage and 80% branch coverage across the shared and testable TypeScript modules in this repository.
- Avoid unrelated refactors while working on a focused task.

## Repo Notes

- `packages/core` is for shared TypeScript logic.
- `apps/extension` is for the browser extension.
- `apps/windows` is for the Windows background app shell.
- `security_best_practices_report.md` records security review findings and residual risks.
- Keep the extension smoke tests focused on manifest shape, permissions, and install-time behavior.
- Keep the tray app harness focused on the copy pipeline and shortcut-triggered behavior.
