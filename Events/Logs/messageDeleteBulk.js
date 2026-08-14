const { EmbedBuilder } = require("discord.js");
const { getData } = require("../Client/dbManager");

module.exports = {
  name: "messageBulkDelete",
  once: false,
  async execute(messages) {
    const guild = messages.first()?.guild;
    if (!guild) return;

    const config = getData("logs", guild.id);
    if (!config || !config.logChannelId) return;

    const logChannel = guild.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setTitle("🧹 Mass removal")
      .setDescription(
        `${messages.size} messages were removed from ${messages.first().channel}`,
      )
      .setColor("Orange")
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => null);
  },
};
