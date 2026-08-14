const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "channelUpdate",
  once: false,
  async execute(oldChannel, newChannel) {
    if (!oldChannel.guild) return; // ignore DM channels

    const config = getData("logs", oldChannel.guild.id);
    if (!config || !config.logChannelId) return; // no log channel configured for this guild

    const logChannel = oldChannel.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return; // configured channel no longer exists

    if (oldChannel.name === newChannel.name) return; // only log if the name actually changed

    const fetchedLogs = await oldChannel.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelUpdate,
      })
      .catch(() => null);

    const logEntry = fetchedLogs ? fetchedLogs.entries.first() : null;

    const executor = logEntry ? logEntry.executor : "A stranger"; // who edited the channel

    const embed = new EmbedBuilder()
      .setTitle("📝 Updated Channel")
      .addFields(
        { name: "Edited by", value: `${executor}`, inline: false },
        { name: "Previous Name", value: `${oldChannel.name}`, inline: true },
        { name: "New Name", value: `${newChannel.name}`, inline: true },
      )
      .setColor("Orange")
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => null);
  },
};
