const { Client, ActivityType, Collection } = require("discord.js");
require("dotenv").config({ quiet: true });
// const config = require("./config.json");
// const { token } = require("./config");

const client = new Client({ intents: 53608447 }); // raw intents bitfield (from video #3)

client.slashCommands = new Collection(); // stores all slash commands

require("./handlers/eventHandler").loadEvents(client); // loads all event files

client.login(process.env.TOKEN); // process.env.TOKEN // config.token // token -> pick your token source
