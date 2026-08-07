const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "roleDelete",
  once: false,
  async execute(role) {
    if (!role.guild) return;

    const config = getData("logs", role.guild.id);
    if (!config || !config.logChannelId) return;

    const logChannel = role.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    const fetchedLogs = await role.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleDelete,
      })
      .catch(() => null);

    const logEntry = fetchedLogs ? fetchedLogs.entries.first() : null;

    const executor = logEntry ? logEntry.executor : "A stranger"; // who deleted the role

    const embed = new EmbedBuilder()
      .setTitle("🔴 Deleted Role")
      .setDescription(`The role has been removed: **${role.name}**`)
      .addFields({ name: "👤 Removed by", value: `${executor}`, inline: true })
      .setColor("#FF0000")
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => null);
  },
};
