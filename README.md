# timestamp-copy

`timestamp-copy` is a tiny local utility that copies the current local time to the clipboard in one exact format:

```text
1:56:07PM
```

The product ships as:

- a Chromium Manifest V3 browser extension
- a lightweight Windows tray app built with Tauri
- a shared TypeScript core for timestamp formatting and platform guidance

## Product goal

The tool does one thing:

1. read the current system time
2. format it as `h:mm:ssAM/PM`
3. copy it to the clipboard

No extra text. No notification spam. No window-heavy workflow.

## Behavior

- Uses the device's current system clock through JavaScript `Date`
- Shows hours in 12-hour time
- Keeps minutes and seconds zero-padded
- Uses uppercase `AM` / `PM`
- Omits the space before the meridiem marker
- Produces values like `9:04:02AM` or `12:33:59PM`

## Time accuracy

`timestamp-copy` intentionally uses local system time, not a network time source.

Why:

- the copy action should be instant and offline-safe
- the browser extension and the Windows app should behave the same way
- in Chromium on Linux, macOS, and Windows, `Date` reads from the host operating system clock

This means accuracy depends on the machine's clock being correct. That is the right tradeoff for this utility.

## Architecture

```text
apps/
  extension/   Chromium MV3 extension
  windows/     Tauri tray app
packages/
  core/        Shared TypeScript time formatting and platform guidance
```

### Shared core

The shared core owns:

- timestamp formatting
- system-time based timestamp generation
- platform-aware shortcut guidance

### Browser extension

The extension targets Chromium-based browsers, with Brave explicitly in scope.

Main decisions:

- toolbar click copies immediately
- no popup is attached to the toolbar click
- settings live in a separate React-powered options page
- copy actions run through an offscreen clipboard document to stay compatible with MV3 service workers
- browser shortcut support is exposed as guidance, not forced defaults

Shortcut note:

- Linux users are more likely to want a browser shortcut configured
- Windows users should usually rely on the Windows tray app shortcut to reduce collisions

### Windows app

The Windows app is a tray-only Tauri app.

Main decisions:

- no visible main window in normal use
- left click on the tray icon copies the timestamp
- tray menu contains a manual `Copy current time` action
- a global shortcut triggers the same copy path
- a hidden webview hosts the shared TypeScript runtime so the formatting logic stays consistent with the extension

## Security stance

This project is intentionally conservative:

- no remote APIs
- no telemetry
- no remote code loading
- minimal permissions for the extension
- no dangerous HTML rendering
- no clipboard reads, only writes
- secure-by-default review tracked in `security_best_practices_report.md`

## Testing and coverage

The repository targets:

- at least 80% line coverage
- at least 80% branch coverage

These thresholds are enforced on the shared and testable TypeScript modules first, and should expand with the product as more behavior becomes directly testable.

## Tooling

- TypeScript workspace
- Vitest for unit tests and coverage
- Vite for app bundling
- Semantic Release for automated versioning and release notes
- GitHub Actions for CI and release automation

## Getting started

### Install dependencies

```bash
npm install
```

### Run tests

```bash
npm test
```

### Type-check the workspace

```bash
npm run typecheck
```

### Build everything

```bash
npm run build
```

### Build only the extension

```bash
npm run build --workspace @timestamp-copy/extension
```

### Package the extension for loading in Brave or Chromium

After building the extension, load the unpacked folder from `apps/extension/dist`.
If you prefer a zip, use the packaged artifact at `artifacts/timestamp-copy-extension.zip`.

To create the zip yourself, run `npm run package:extension` after the extension build.

### Install the extension in Brave or Chromium

1. Build the extension with `npm run build --workspace @timestamp-copy/extension`.
2. Open `brave://extensions` or `chrome://extensions`.
3. Enable `Developer mode`.
4. Choose `Load unpacked`.
5. Select `apps/extension/dist`.
6. To use a zip instead, unzip `artifacts/timestamp-copy-extension.zip` first and load the extracted folder.

### Run the Windows tray app in development

```bash
npm run tauri:dev --workspace @timestamp-copy/windows
```

## Release workflow

Semantic Release is configured for `main` and expects CI-driven publishing. Since this repository is private, npm publishing is disabled by default; release automation is used for changelogs, GitHub releases, and version bookkeeping.

## Repository map

- `AGENTS.md` repository working rules
- `packages/core` shared timestamp and guidance logic
- `apps/extension` Chromium extension
- `apps/windows` Tauri tray application
- `.github/workflows` CI and release automation
- `security_best_practices_report.md` security review notes
