const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel."),
  async execute(interaction, client) {
    const player = client.manager.players.get(interaction.guildId); // get this guild's active player

    if (!player) {
      return interaction.reply("❌ I'm not in a voice channel.");
    }

    if (
      !interaction.member.voice.channel ||
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    ) {
      return interaction.reply(
        "❌ You must be in the same voice channel as me.", // prevent pausing from another channel
      );
    }

    player.destroy(); // actually leave the voice channel

    return interaction.reply("🚪 I have left the voice channel.");
  },
};
