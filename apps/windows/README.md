# Windows App

Tray-only Tauri shell for `timestamp-copy`.

Behavior:

- left click on the tray icon copies the current time
- tray menu offers a manual `Copy current time` action
- a global shortcut triggers the same copy path
- the app does not present a normal window during use

The hidden webview exists only to keep the TypeScript formatter shared with the extension.
