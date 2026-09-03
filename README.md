# 🤖 discord-bot-tutorial

A modular Discord bot built with **Discord.js v14** and **Node.js**.

⚡ Slash commands · 📋 Guild event logging · 🎭 Automated role assignment

[![Deploy on Bot-Hosting.net](https://img.shields.io/badge/Deploy-Bot--Hosting.net-orange?logo=discord&logoColor=white)](https://bot-hosting.net/templates/discord-tutorial-2026)
[![License: MIT](https://img.shields.io/github/license/choco-latito29/discord-bot-tutorial)](./LICENSE)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/node-22-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Lint](https://img.shields.io/github/actions/workflow/status/choco-latito29/discord-bot-tutorial/lint.yml?label=lint&logo=eslint)](./.github/workflows/lint.yml)
[![Validate](https://img.shields.io/github/actions/workflow/status/choco-latito29/discord-bot-tutorial/validate.yml?label=validate&logo=githubactions&logoColor=white)](./.github/workflows/validate.yml)
[![GitHub stars](https://img.shields.io/github/stars/choco-latito29/discord-bot-tutorial?style=flat&logo=github)](https://github.com/choco-latito29/discord-bot-tutorial/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/choco-latito29/discord-bot-tutorial)](https://github.com/choco-latito29/discord-bot-tutorial/commits/main)
[![Repo size](https://img.shields.io/github/repo-size/choco-latito29/discord-bot-tutorial)](https://github.com/choco-latito29/discord-bot-tutorial)
[![Support Server](https://img.shields.io/badge/Support-Discord-5865F2?logo=discord&logoColor=white)](https://discord.gg/smp7hwrXr4)

## 🧠 About

This project is a hands-on Discord bot built to learn `discord.js` v14 in practice — no boilerplate generators, no all-in-one frameworks, just modular code you can read top to bottom. It's structured the way a small production bot would be: event handlers, slash commands, and a lightweight database are all auto-loaded and organized by category, so adding a new feature usually means dropping in a single file rather than editing a giant `index.js`.

[![Architecture](https://img.shields.io/badge/architecture-event--driven-blueviolet)](./Events)
[![Style guide](https://img.shields.io/badge/code%20style-eslint-4B32C3?logo=eslint&logoColor=white)](./eslint.config.js)

## 🚀 Deploy

Want to try it without setting it up locally? Deploy it in one click as a community template on Bot-Hosting.net:

[![Deploy on Bot-Hosting.net](https://img.shields.io/badge/Deploy-Bot--Hosting.net-orange?logo=discord&logoColor=white)](https://bot-hosting.net/templates/discord-tutorial-2026)
[![Deployments](https://img.shields.io/badge/deployments-150%2B-brightgreen)](https://bot-hosting.net/templates/discord-tutorial-2026)
[![Community Template](https://img.shields.io/badge/Bot--Hosting.net-Community%20Template-blue?logo=cloudflare&logoColor=white)](https://bot-hosting.net/templates/discord-tutorial-2026)

👉 **[Click here to deploy](https://bot-hosting.net/templates/discord-tutorial-2026)**

## ✨ Features

- ⚡ **Slash commands** — modular, auto-loaded from `slashcommands/`
- 🎭 **Autorole** — automatic role assignment for users/bots on join, with role-hierarchy and admin-permission safety checks
- 📋 **Guild logging** — channel and role create/update/delete, message delete/bulk delete/update
- 🚫 **Blacklist system** — block users from using the bot with reason, evidence, and automatic expiration
- 🎵 **Music** — Lavalink-powered music playback via `moonlink.js`
- 🗃️ **Local JSON database** — lightweight file-based storage per guild

## 📦 Requirements

- 🟢 Node.js `22`
- 🤖 A Discord bot application ([Discord Developer Portal](https://discord.com/developers/applications))

## 🛠️ Setup

**1.** Clone the repository and install dependencies:

```bash
git clone https://github.com/choco-latito29/discord-bot-tutorial.git

cd discord-bot-tutorial

npm install
```

**2.** Copy the example environment file and fill in your bot token:

```bash
cp .env.example .env
```

```ignore
TOKEN=your_bot_token_here
```

**3.** Run the bot:

```bash
npm start -s
```

## 🗂️ Project structure

```
📁 Events/          Event listeners (client, guild, interaction, logging)
📁 handlers/        Dynamic loaders for events and slash commands
📁 slashcommands/   Slash commands, grouped by category
📁 database/        Local JSON-based storage
```

## 💬 Support

Need help or found a bug? Check [SUPPORT.md](./.github/SUPPORT.md) or join the [support server](https://discord.gg/smp7hwrXr4).

🔒 For security-related concerns, please follow the process in [SECURITY.md](./.github/SECURITY.md) instead of opening a public issue.

## 📄 License

MIT — see [LICENSE](./LICENSE).
