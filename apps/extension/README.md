# Extension App

Chromium Manifest V3 extension for `timestamp-copy`.

Behavior:

- clicking the toolbar icon copies the current time immediately
- an options page provides a toggle for the optional browser shortcut
- MV3 background logic uses an offscreen document for clipboard writes
- the browser extension is always active, and the shortcut is opt-in

The extension intentionally avoids a default keyboard shortcut so Windows users do not collide with the desktop app by default.
If you want to use a browser hotkey, turn it on in the settings page and assign one in Chromium or Brave.
Avoid `Ctrl+Shift+T`; Chromium uses that shortcut for reopening closed tabs. `Alt+Shift+T` is a safer choice.
