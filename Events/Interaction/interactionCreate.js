const { EmbedBuilder } = require("discord.js");
const { getData, setData } = require("../Client/dbManager");
const GLOBAL_KEY = "GLOBAL";

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return; // ignore anything that isn't a slash command

    const command = client.slashCommands.get(interaction.commandName); // find the matching command

    const database = getData("blacklist", GLOBAL_KEY) || {
      users: {},
    };

    const entry = database.users?.[interaction.user.id]; // check if this user is blacklisted

    if (entry) {
      const now = Date.now();

      const isExpired = entry.expiresAt && now >= entry.expiresAt;

      if (isExpired) {
        delete database.users[interaction.user.id]; // clean up expired entry

        setData("blacklist", GLOBAL_KEY, database);
        // block expired, fall through and let the command run below
      } else {
        const expiresText = entry.expiresAt
          ? `<t:${Math.floor(entry.expiresAt / 1000)}:R> (<t:${Math.floor(entry.expiresAt / 1000)}:F>)`
          : "🔒 Permanent";

        const blockedEmbed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("🚫 Access denied")
          .setDescription(
            "You are on the bot's blacklist and cannot use any commands.",
          )
          .addFields(
            { name: "📝 Reason", value: entry.reason, inline: false },
            { name: "📅 Expires", value: expiresText, inline: false },
          )
          .setFooter({
            text: "If you believe this is a mistake, contact an administrator.",
          })
          .setTimestamp();

        return interaction.reply({ embeds: [blockedEmbed], ephemeral: true }); // stop here, don't run the command
      }
    }

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
