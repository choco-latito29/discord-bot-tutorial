# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Music system: Lavalink connection setup via `moonlink.js`, node event logging, track start/queue end handlers, and the `/play`, `/pause`, and `/continue` commands.
- Blacklist system: `/blacklist add`, `/blacklist remove`, and `/blacklist list` subcommands, with automatic expiration handling in `interactionCreate`.
- Guild join/leave logging (`guildCreate`, `guildDelete`) and an owner-only `/exit` command to make the bot leave a server by ID.
- `.github` community health files (issue templates, funding, security policy, support) and CI workflows (`lint.yml`, `validate.yml`).
- `README.md` with setup instructions, feature list, and badges.
- `.env.example`, `.gitattributes`, `.editorconfig`, and `.nvmrc` for consistent local setup across contributors.

### Changed

- Renamed the `estados` array to `states` in `ready.js` for full English consistency across the codebase.
- Renamed `/leave` command to `/exit`.
- `OWNER_ID` and `LOGS_CHANNEL_ID` in `blacklist.js` and `exit.js` now read from environment variables instead of hardcoded placeholder strings.

### Fixed

- `/blacklist` and `/exit` were unusable by anyone, including the bot owner, because the owner check compared against a literal placeholder string (`"USER_OWNER_ID"` / `"USER_ID"`) that was never replaced.

### Chore

- Added ESLint flat config (`eslint.config.js`) and fixed all lint warnings across the codebase.
- Updated `.github/SECURITY.md` contact email to `choco@worddevs.dev`.
- Scoped `.github/FUNDING.yml` to the personal account only.

## [0.1.0] - 2026-08-06

### Added

- Core bot setup: `index.js`, event handler, slash command handler.
- `clientReady` event with rotating bot presences/status.
- `interactionCreate` event with error handling.
- `/ping` command.
- Autorole system: `/autorole add`, `/autorole delete`, `/autorole show`, and automatic role assignment on member join.
- Guild logging system: channel create/update/delete, message delete/bulk delete/update, role create/update/delete.
- Local JSON-based database manager (`dbManager.js`).
