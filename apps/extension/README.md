# Extension App

Chromium Manifest V3 extension for `timestamp-copy`.

Behavior:

- clicking the toolbar icon copies the current time immediately
- an options page provides platform-aware shortcut guidance
- MV3 background logic uses an offscreen document for clipboard writes

The extension intentionally avoids a default keyboard shortcut so Windows users do not collide with the desktop app by default.
