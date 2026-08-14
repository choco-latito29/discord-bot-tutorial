# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Chore

- Added ESLint flat config (`eslint.config.js`) and fixed all lint warnings across the codebase.

### Chore

- Added `.github` community health files (issue templates, funding, security policy, support) and CI workflows (`lint.yml`, `validate.yml`).

### Added

- Music system: Lavalink connection setup via `moonlink.js`, node event logging, track start/queue end handlers, and the `/play` command.

### Added

- Blacklist system: `/blacklist add`, `/blacklist remove`, and `/blacklist list` subcommands, with automatic expiration handling in `interactionCreate`.

### Added

- Guild join/leave logging (`guildCreate`, `guildDelete`) and an owner-only `/leave` command to make the bot leave a server by ID.

### Changed

- Renamed the `estados` array to `states` in `ready.js` for full English consistency across the codebase.

## [0.1.0] - Initial Commit

### Added

- Core bot setup: `index.js`, event handler, slash command handler.
- `clientReady` event with rotating bot presences/status.
- `interactionCreate` event with error handling.
- `/ping` command.
- Autorole system: `/autorole add`, `/autorole delete`, `/autorole show`, and automatic role assignment on member join.
- Guild logging system: channel create/update/delete, message delete/bulk delete/update, role create/update/delete.
- Local JSON-based database manager (`dbManager.js`).
