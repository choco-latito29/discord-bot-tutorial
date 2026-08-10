const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Make the bot leave a server.")
    .addStringOption((option) =>
      option.setName("id").setDescription("Server ID.").setRequired(true),
    ),
  async execute(interaction, client) {
    const id = interaction.options.getString("id"); // fixed: was "ids", singular value

    if (interaction.user.id !== "USER_ID") {
      return interaction.reply({
        content: `❌ You can't use this command.`, // owner-only command
        flags: 64, // ephemeral: only visible to the user who ran it
      });
    }

    const guild = client.guilds.cache.get(id);

    if (!guild) {
      return interaction.reply({
        content: `❌ I'm not in that server.`,
        flags: 64,
      });
    }

    await guild.leave();

    interaction.reply({
      content: `✅ Left the server: ${guild.name}`,
      flags: 64,
    });
  },
};
