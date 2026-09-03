const {
  EmbedBuilder,
  AuditLogEvent,
  PermissionsBitField,
} = require("discord.js");
const { getData } = require("../Client/dbManager");

const cooldowns = new Map(); // prevents processing the same role update twice in a short window

module.exports = {
  name: "roleUpdate",
  once: false,
  async execute(oldRole, newRole) {
    if (!oldRole.guild) return;

    const key = `${oldRole.guild.id}-${oldRole.id}`;

    if (cooldowns.has(key)) return; // already handling an update for this role, skip
    cooldowns.set(key, true);

    setTimeout(() => cooldowns.delete(key), 1000); // release the cooldown after 1s

    const config = getData("logs", oldRole.guild.id);
    if (!config || !config.logChannelId) return;

    const logChannel = oldRole.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    await new Promise((r) => setTimeout(r, 700)); // small delay so the audit log has time to register

    const fetchedLogs = await oldRole.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleUpdate,
      })
      .catch(() => null);

    const logEntry = fetchedLogs ? fetchedLogs.entries.first() : null;

    const executor =
      logEntry && logEntry.targetId === oldRole.id
        ? logEntry.executor
        : "A stranger";

    const fields = [];

    if (oldRole.name !== newRole.name) {
      fields.push({
        name: "📝 Name",
        value: `Before: ${oldRole.name}\nNow: ${newRole.name}`,
      });
    }

    if (oldRole.color !== newRole.color) {
      fields.push({
        name: "🎨 Color",
        value: `Before: #${oldRole.color.toString(16).padStart(6, "0")}\nNow: #${newRole.color.toString(16).padStart(6, "0")}`,
        inline: true,
      });
    }

    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      const oldP = new PermissionsBitField(oldRole.permissions).toArray();
      const newP = new PermissionsBitField(newRole.permissions).toArray();

      const add = newP.filter((p) => !oldP.includes(p)); // permissions gained
      const rem = oldP.filter((p) => !newP.includes(p)); // permissions lost

      if (add.length) fields.push({ name: "✅ Added", value: add.join(", ") });
      if (rem.length)
        fields.push({ name: "❌ Removed", value: rem.join(", ") });
    }

    if (fields.length === 0) return; // nothing relevant changed, don't log

    const embed = new EmbedBuilder()
      .setTitle("📝 Edited Role")
      .setDescription(`Changes in role have been detected: **${newRole}**`)
      .addFields({ name: "👤 Made by", value: `${executor}` }, ...fields)
      .setColor(newRole.color || "#FFFF00")
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => null);
  },
};
