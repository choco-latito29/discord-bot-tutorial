const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const { setData } = require("../../Events/Client/dbManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-logs")
    .setDescription("Configure the channel for the logs.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The text channel for logs.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    setData("logs", interaction.guild.id, { logChannelId: channel.id });

    await interaction.reply({
      content: `✅ Channel registration configured in: ${channel}`,
      ephemeral: true,
    });
  },
};
