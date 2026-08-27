const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("continue")
    .setDescription("Resume the song."),
  async execute(interaction, client) {
    const player = client.manager.players.get(interaction.guildId); // get this guild's active player

    if (!player || !player.current) {
      return interaction.reply("❌ There's no song currently playing.");
    }

    if (
      !interaction.member.voice.channel ||
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    ) {
      return interaction.reply(
        "❌ You must be in the same voice channel as me.",
      );
    }

    if (!player.paused) {
      // only resume if it's actually paused
      return interaction.reply("⚠️ The music isn't paused.");
    }

    player.resume(); // resume playback

    return interaction.reply("▶️ Music resumed successfully.");
  },
};
