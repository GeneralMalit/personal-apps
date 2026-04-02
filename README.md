# timestamp-copy

`timestamp-copy` is a small helper for people who track time carefully and want the exact current time copied fast, in the same format everywhere:

```text
1:56:07PM
```

I built it because I track my life too much, I need exact numbers, and I wanted one helper that works the same across platforms. That is why this project has both a Windows app and a web extension: you can jump between them without changing how the time is formatted or copied.

## Install

### Windows

- Download the `.msi` from the release page
- Run the installer
- Open `timestamp-copy` from the Start Menu or desktop shortcut
- The app runs in the tray and stays out of the way

### Extension

- Download the extension zip from the release page
- Unzip it
- In Brave or Chrome, open the extensions page, enable Developer Mode, and load the unpacked folder
- If you build locally, use `apps/extension/dist`

### Release layout

- Windows app and extension are released separately
- Release assets include:
  - the Windows `.msi`
  - the browser extension zip
  - the source code archive provided by GitHub

The installer now uses a clipboard/clock glyph (stored under `apps/windows/src-tauri/icons`) so the release looks less like a generic binary. If you want to refresh that icon later, swap in a new PNG/ICO there.

## Tech Stack

- TypeScript for the shared timestamp formatting logic
- Chromium Manifest V3 for the extension
- React for the small extension settings page
- Tauri for the Windows tray app
- Vitest for tests and coverage
- Vite for builds
- Semantic Release for versioning and release notes

Why these choices:

- TypeScript keeps the timestamp format identical across the app and extension
- MV3 keeps the extension compatible with modern Chromium browsers
- Tauri keeps the Windows app lightweight for a tray-only utility
- React is only used where it helps, which is the settings page

## License

MIT
