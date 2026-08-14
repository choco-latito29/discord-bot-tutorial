const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "messageDelete",
  once: false,
  async execute(message) {
    if (!message.guild) return; // ignore DMs

    if (message.partial) await message.fetch().catch(() => null); // fetch full data if it's a partial message
    if (message.author?.bot) return; // ignore bot messages

    const config = getData("logs", message.guild.id);
    if (!config || !config.logChannelId) return;

    const logChannel = message.guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    const fetchedLogs = await message.guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete,
      })
      .catch(() => null);

    const logEntry = fetchedLogs ? fetchedLogs.entries.first() : null;

    let executor = "A stranger";

    if (logEntry) {
      const time = Date.now() - logEntry.createdTimestamp;

      if (time < 5000 && logEntry.target.id === message.author.id) {
        // only trust the audit log entry if it's recent (<5s) AND targets this exact author
        executor = logEntry.executor;
      }
    }

    const content = message.content || "No text";
    const image = message.attachments
      .filter((a) => a.contentType?.startsWith("image")) // keep only image attachments
      .map((a) => a.url);

    const embed = new EmbedBuilder()
      .setTitle("🗑️ Deleted Message")
      .addFields(
        {
          name: "User",
          value: `${message.author} (${message.author.id})`,
          inline: true,
        },
        { name: "Channel", value: `${message.channel}`, inline: true },
        { name: "Removed by", value: `${executor}`, inline: true },
        { name: "Content", value: content.slice(0, 1024) }, // embed field value max length is 1024
      )
      .setColor("Red")
      .setTimestamp();

    if (image.length > 0) {
      embed.addFields({
        name: "🖼️ Images:",
        value: image.join("\n").slice(0, 1024),
      });
      embed.setImage(image[0]); // preview the first image
    }

    logChannel.send({ embeds: [embed] }).catch(() => null);
  },
};
