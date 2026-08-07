const { readdirSync } = require("fs");

module.exports = {
  async loadEvents(client) {
    readdirSync(process.cwd() + "/Events").forEach((folder) => {
      // loop through each folder in /Events
      readdirSync(process.cwd() + `/Events/${folder}`)
        .filter((file) => file.endsWith(".js")) // only load .js files
        .forEach((file) => {
          const event = require(process.cwd() + `/Events/${folder}/${file}`); // import the event file

          if (event.once) {
            client.once(
              event.name,
              (
                ...args // listen only once (e.g. "ready" event)
              ) => event.execute(...args, client),
            );
          } else {
            client.on(event.name, (...args) => event.execute(...args, client)); // listen every time the event fires
          }
        });
    });

    console.info(`✅ Events loaded successfully!`);
  },
};
