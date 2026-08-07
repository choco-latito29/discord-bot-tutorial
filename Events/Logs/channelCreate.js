const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "channelCreate",
  once: false,
  async execute(channel, client) {
    if (!channel.guild) return; // ignore DM channels

    const config = getData("logs", channel.guild.id);
    if (!config || !config.logChannelId) return; // no log channel configured for this guild

    const logChannel = channel.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return; // configured channel no longer exists

    const fetchedLogs = await channel.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelCreate,
      })
      .catch(() => null);

    const logEntry = fetchedLogs ? fetchedLogs.entries.first() : null;

    const executor = logEntry ? logEntry.executor : "A stranger"; // who created the channel

    const embed = new EmbedBuilder()
      .setTitle("✅ Created Channel")
      .setDescription(`The channel has been created: **${channel.name}**`)
      .addFields(
        { name: "Created by", value: `${executor}`, inline: true },
        { name: "Mention", value: `${channel}`, inline: true },
      )
      .setColor("Green")
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => null); // send log, ignore if it fails
  },
};
