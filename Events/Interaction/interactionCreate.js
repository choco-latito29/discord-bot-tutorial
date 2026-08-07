module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return; // ignore anything that isn't a slash command

    const command = client.slashCommands.get(interaction.commandName); // find the matching command

    if (!command) return; // command doesn't exist, stop here

    try {
      await command.execute(interaction, client); // run the command
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          // interaction already responded, send a follow-up
          content: "❌ There was an error executing the command.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          // interaction not yet responded, send the initial reply
          content: "❌ There was an error executing the command.",
          ephemeral: true,
        });
      }
    }
  },
};
