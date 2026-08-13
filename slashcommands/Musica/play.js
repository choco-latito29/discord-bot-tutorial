const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song or adds it to the queue.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Type the song name or paste the song link")
        .setRequired(true),
    ),
  async execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;

    const query = interaction.options.getString("song");

    if (!voiceChannel) {
      return interaction.reply({
        content: "❌ You must join a voice channel first.",
        ephemeral: true,
      });
    }

    const botChannel = interaction.guild.members.me.voice.channel; // voice channel the bot is currently in (if any)

    if (botChannel && botChannel.id !== voiceChannel.id) {
      return interaction.reply({
        content: "❌ I'm already playing music in another voice channel.",
        ephemeral: true,
      });
    }

    await interaction.deferReply(); // search can take a few seconds, so acknowledge the interaction first

    try {
      const result = await client.manager.search({
        query,
        requester: interaction.user,
      });

      if (!result?.tracks?.length) {
        return interaction.editReply({
          // must use editReply, not reply, since deferReply already ran
          content: "❌ No song was found.",
        });
      }

      const track = result.tracks[0]; // only the first result, since resultLimit is set to 1

      let player = client.manager.players.get(interaction.guildId); // reuse an existing player for this server if one exists

      if (!player) {
        player = client.manager.players.create({
          guildId: interaction.guildId,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channelId,
          autoPlay: false,
          selfDeaf: true, // bot deafens itself, doesn't need to hear other users
          volume: 100,
        });

        await player.connect();
      }

      player.queue.add(track);

      if (!player.playing && !player.paused) {
        await player.play(); // only start playback if nothing is currently playing/paused (otherwise just queue it)
      }

      return interaction.editReply({
        content: `🎵 Added to queue: **${track.title}**`,
      });
    } catch (error) {
      console.error("[MUSIC] Error in /play:", error);

      return interaction.editReply({
        content: "❌ An error occurred while searching or playing the song.",
      });
    }
  },
};
