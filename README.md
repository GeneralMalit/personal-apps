# timestamp-copy

`timestamp-copy` is a tiny utility that copies the current time to the clipboard in this exact format:

```text
1:56:07PM
```

The product is planned as:

- a Manifest V3 browser extension
- a lightweight Windows app
- a shared TypeScript core for formatting logic

## Core behavior

- Generate the local current time
- Format it with hour, minute, and second precision
- Use 12-hour time with uppercase `AM` / `PM`
- Do not include spaces before `AM` / `PM`
- Copy the formatted value to the clipboard

## Planned architecture

```text
apps/
  extension/   Browser extension (Manifest V3, React UI, clipboard + commands APIs)
  windows/     Lightweight Windows app shell
packages/
  core/        Shared TypeScript timestamp formatting logic
```

## Initial scope

### Browser extension

- Manifest V3
- lightweight React UI
- browser clipboard API
- commands API for keyboard shortcuts

### Windows app

- background-style app
- single click action copies the same formatted timestamp
- uses the shared core logic for formatting

## Workspace

This repo starts as a TypeScript workspace so we can share logic cleanly between clients.

## Next build steps

1. Wire up the shared core package with tests.
2. Build the extension background action and popup.
3. Choose the Windows shell approach (`Tauri`, `Electron`, or a native wrapper around a web UI).
4. Connect both clients to the same clipboard-copy flow.
