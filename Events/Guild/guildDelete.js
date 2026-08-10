const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildDelete",
  async execute(guild, client) {
    let ownerTag = "Unknown";

    try {
      const owner = await guild.fetchOwner(); // may fail if the bot no longer has access to the guild

      ownerTag = owner.user.tag;
    } catch (error) {}

    const embed = new EmbedBuilder()
      .setTitle("📤 Removed from a server")
      .addFields(
        { name: "Server", value: guild.name || "Unknown", inline: true },
        { name: "ID", value: guild.id, inline: true },
        { name: "Owner", value: `${ownerTag}`, inline: true },
      )
      .setThumbnail(guild.iconURL({ dynamic: true }) || null)
      .setColor("Red")
      .setTimestamp();

    const channel = client.channels.cache.get("CHANNEL_ID"); // your private log channel

    if (channel) {
      channel.send({ embeds: [embed] });
    }
  },
};
