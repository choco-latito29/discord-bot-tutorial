const { readdirSync } = require("fs");

module.exports = {
  async loadSlash(client) {
    const commands = []; // will store all commands in JSON format for registration

    for (const category of readdirSync("./slashcommands")) {
      // loop through each category folder
      const files = readdirSync(`./slashcommands/${category}`).filter(
        (file) => file.endsWith(".js"), // only load .js files
      );

      for (const file of files) {
        const command = require(`../slashcommands/${category}/${file}`); // import the command file

        client.slashCommands.set(command.data.name, command); // register command in the client's collection

        commands.push(command.data.toJSON()); // add command data for Discord API registration
      }
    }

    await client.application.commands.set(commands); // register/update slash commands on Discord

    console.info(`✅ Slash commands loaded successfully!`);
  },
};
