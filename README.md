# personal-apps

`personal-apps` is my collection repo for daily-use applications and utilities.
It currently contains the `timestamp-copy` submodule, and future apps can live
here as additional nested repos when they belong to the same day-to-day suite.

## Current Projects

- `timestamp-copy` - nested repo for copying the exact current time in
  `h:mm:ssAM/PM` format from both a Windows tray app and a Chromium extension.
- `curveball`

## How to Add a New Project

- Add a short entry to `README.md` with the project name and purpose.
- Keep shared code in packages when multiple apps need the same behavior.
- Add or update tests for any shared logic.
- Update the local `AGENTS.md` notes if the repo structure or policy changes.

## Repo Policy

- Default to keeping new daily-use apps inside this repository as submodules or
  other nested repos.
- Split a project into its own repo when it needs its own release cadence,
  independent ownership, or a cleaner public boundary.
- Keep the repo focused on practical apps I actually use.

## License

MIT
