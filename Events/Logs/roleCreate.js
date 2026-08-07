const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "roleCreate",
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
        type: AuditLogEvent.RoleCreate,
      })
      .catch(() => null);

    const logEntry = fetchedLogs ? fetchedLogs.entries.first() : null;

    const executor = logEntry ? logEntry.executor : "A stranger"; // who created the role

    const embed = new EmbedBuilder()
      .setTitle("🆕 New Role Created")
      .setDescription(`New Role Created: **${role.name}**`)
      .addFields(
        { name: "👤 Created by", value: `${executor}`, inline: true },
        {
          name: "🎨 Initial color",
          value: `#${role.color.toString(16).padStart(6, "0")}`, // hex color, padded to 6 digits
          inline: true,
        },
        { name: "📍 Position", value: `${role.position}`, inline: true },
      )
      .setColor(role.color || "#00FF00") // fallback color if role has no color set
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => null);
  },
};
