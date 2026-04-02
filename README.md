# timestamp-copy

`timestamp-copy` is a small helper for people who track time carefully and want the exact current time copied fast, in the same format everywhere:

```text
1:56:07PM
```

I built it because I track my life too much, I need exact numbers, and I wanted one helper that works the same across platforms. That is why this project has both a Windows app and a web extension: you can jump between them without changing how the time is formatted or copied.

## Install

### Windows app

- Release format: `.msi`
- Download the Windows installer from the release assets
- Run the installer and open `timestamp-copy` from the Start Menu or desktop shortcut
- The app runs as a tray app, so it stays out of your way

### Web extension

- Browser target: Chromium-based browsers, including Brave
- Download the extension release zip, or build locally and load `apps/extension/dist` as unpacked
- In Brave or Chrome, open the extensions page, enable Developer Mode, and load the unpacked folder
- If you prefer the packaged artifact, unzip the extension release first and load the extracted folder

### Separate releases

The Windows app and the browser extension are packaged separately on purpose:

- the Windows app ships as its own `.msi`
- the browser extension ships as its own extension package

That keeps each platform simple and avoids forcing one install path on every user.

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

