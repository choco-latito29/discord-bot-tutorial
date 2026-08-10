const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildCreate",
  async execute(guild, client) {
    const owner = await guild.fetchOwner(); // fetch the server owner's info

    const embed = new EmbedBuilder()
      .setTitle("📥 Added to a server")
      .addFields(
        { name: "Server", value: guild.name, inline: true },
        { name: "ID", value: guild.id, inline: true },
        { name: "Members", value: `${guild.memberCount}`, inline: true },
        { name: "Owner", value: `${owner.user.tag}`, inline: true },
      )
      .setThumbnail(guild.iconURL({ dynamic: true }) || null) // server icon, or none if it has no icon
      .setColor("Green")
      .setTimestamp();

    const channel = client.channels.cache.get("CHANNEL_ID"); // your private log channel

    if (channel) {
      channel.send({ embeds: [embed] });
    }
  },
};
