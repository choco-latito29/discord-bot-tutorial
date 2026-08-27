const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song."),
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
        "❌ You must be in the same voice channel as me.", // prevent pausing from another channel
      );
    }

    if (player.paused) {
      // player.paused is the state, not the pause() method
      return interaction.reply("⚠️ The music is already paused.");
    }

    player.pause(); // actually pause playback

    return interaction.reply("⏸️ Music paused successfully.");
  },
};
