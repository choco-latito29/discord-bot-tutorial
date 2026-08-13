module.exports = (client) => {
  if (!client.manager) return; // safety check in case moonlink failed to initialize

  client.manager.on("trackStart", async (player, track) => {
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;

    await channel.send(`🎶 Now playing: **${track.title}**`).catch(() => {}); // ignore errors (e.g. missing permissions, deleted channel)
  });

  client.manager.on("queueEnd", async (player) => {
    const channel = client.channels.cache.get(player.textChannelId);

    if (channel) {
      await channel
        .send("✅ Queue finished. Leaving the voice channel.")
        .catch(() => {}); // ignore errors (e.g. missing permissions, deleted channel)
    }

    player.destroy(); // disconnects the bot from the voice channel and cleans up the player
  });
};
