const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the Bot's latency."),
  async execute(interaction) {
    const ping = Date.now() - interaction.createdTimestamp; // calculate latency in ms

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`🏓 Ping the Bot: **${ping} ms**`); // message shown to the user

    await interaction.reply({ embeds: [embed] }); // send the embed as a reply
  },
};
