const { ActivityType } = require("discord.js");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    console.info(`✅ Bot is online as ${client.user.tag}!`);

    await require("../../handlers/slashHandler").loadSlash(client);

    // ActivityType: Playing = 0, Streaming = 1, Listening = 2, Watching = 3, Custom = 4, Competing = 5
    // status: online = green, idle = yellow, dnd = red, invisible = gray

    const states = [
      { name: "Minecraft", type: ActivityType.Playing, status: "dnd" },
      { name: "Terraria", type: ActivityType.Playing, status: "dnd" },
      {
        name: `${client.guilds.cache.size} servers`,
        type: ActivityType.Playing,
        status: "dnd",
      },
      { name: "Roblox", type: ActivityType.Playing, status: "dnd" },
      { name: "Valorant", type: ActivityType.Playing, status: "dnd" },

      /*{
        name: "Twitch",
        type: ActivityType.Streaming, // needs url below to work
        url: "https://www.twitch.tv/your_twitch_channel",
        status: "dnd",
      },*/
      /*{ name: "Spotify", type: ActivityType.Listening, status: "online" },*/
      /*{ name: "YouTube Tutorials", type: ActivityType.Watching, status: "idle" },*/
      /*{ name: "for the #1 spot", type: ActivityType.Competing, status: "online" },*/
      /*{ name: "Custom status text here", type: ActivityType.Custom, status: "online" },*/
      /*{ name: "chess.com", type: ActivityType.Playing, status: "invisible" },*/
    ];

    let i = 0;

    setInterval(() => {
      const actual = states[i];

      client.user.setPresence({
        activities: [
          {
            name: actual.name,
            type: actual.type,
            url: actual.url || undefined,
          },
        ],
        status: actual.status,
      });
      i = (i + 1) % states.length;
    }, 5000); // (5000ms = 5 seconds)
  },
};
