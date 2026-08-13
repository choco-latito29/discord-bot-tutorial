const { Manager } = require("moonlink.js");

module.exports = (client) => {
  if (client.manager) return; // prevents creating a second manager on hot reload

  const nodes = [
    {
      identifier: "Public Lavalink Node", // Identifierd for console the lavalink
      host: "lava-v4.millohost.my.id", // HostName to lavalink connect
      port: 443, // Port connect server Lavalink
      password: "https://discord.gg/mjS5J2K3ep", // ⚠️ Lavalink password connect sencibility secret
      secure: true, // true = use wss:// (required for port 443)
      retryAmount: 10, // how many times to retry connecting before giving up
      retryDelay: 5000, // ms between reconnect attempts
    },
  ];

  client.manager = new Manager({
    nodes: nodes,
    reconnectTries: 10,
    reconnectTimeout: 5000,
    options: {
      search: {
        defaultPlatform: "youtube",
        resultLimit: 1, // only take the first search result
      },
    },
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);

      if (guild) guild.shard.send(payload); // required by moonlink to forward voice packets to Discord
    },
  });

  client.on("raw", (packet) => {
    if (
      packet.t === "VOICE_STATE_UPDATE" ||
      packet.t === "VOICE_SERVER_UPDATE"
    ) {
      client.manager.packetUpdate(packet); // forwards raw voice packets to moonlink
    }
  });

  client.manager.on("nodeConnected", (node) => {
    console.info(`[LAVALINK] Node connected: ${node.identifier}`);
  });

  client.manager.on("nodeReconnect", (node) => {
    console.info(`[LAVALINK] Reconnecting to node ${node.identifier}`);
  });

  client.manager.on("nodeError", (node, error) => {
    console.info(
      `[LAVALINK] Error on ${node.identifier}: ${error?.message || error}`,
    );
  });

  client.manager.init(client.user.id); // must run after the client is ready
};
