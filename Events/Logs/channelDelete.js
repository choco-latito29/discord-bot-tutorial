const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "channelDelete",
  once: false,
  async execute(channel) {
    if (!channel.guild) return; // ignore DM channels

    const config = getData("logs", channel.guild.id);
    if (!config || !config.logChannelId) return; // no log channel configured for this guild

    const logChannel = channel.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return; // configured channel no longer exists

    const fetchedLogs = await channel.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelDelete,
      })
      .catch(() => null);

    const logEntry = fetchedLogs ? fetchedLogs.entries.first() : null;

    const executor = logEntry ? logEntry.executor : "A stranger"; // who deleted the channel

    const embed = new EmbedBuilder()
      .setTitle("🗑️ Deleted Channel")
      .addFields(
        { name: "Removed by", value: `${executor}`, inline: true }, // fixed typo: "byy" -> "by"
        { name: "channel ID", value: `\`\`${channel.id}\`\``, inline: true }, // channel object no longer exists, show ID instead
      )
      .setColor("Red")
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => null);
  },
};
