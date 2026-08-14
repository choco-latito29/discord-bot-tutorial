const { EmbedBuilder } = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "messageUpdate",
  once: false,
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild) return; // ignore DMs

    if (newMessage.partial) await newMessage.fetch().catch(() => null); // fetch full data if it's a partial message
    if (newMessage.author?.bot) return; // ignore bot messages
    if (oldMessage.content === newMessage.content) return; // only log if the text actually changed (ignores embed/link updates)

    const config = getData("logs", newMessage.guild.id);
    if (!config || !config.logChannelId) return;

    const logChannel = newMessage.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setTitle("✏️ Edited Message")
      .addFields(
        {
          name: "User",
          value: `${newMessage.author} (${newMessage.author.id})`,
          inline: true,
        },
        { name: "Channel", value: `${newMessage.channel}`, inline: true },
        {
          name: "Before",
          value: `${oldMessage.content.slice(0, 1024) || "No Content"}`,
        },
        {
          name: "After",
          value: `${newMessage.content.slice(0, 1024) || "No Content"}`,
        },
      )
      .setColor("Yellow")
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => null);
  },
};
