const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { getData, setData } = require("../../Events/Client/dbManager");
const GLOBAL_KEY = "GLOBAL"; // single shared key, blacklist isn't per-guild
const OWNER_ID = "USER_OWNER_ID"; // Owener id permission
const ID_CHANEL_LOGS = "CHANNEL_REPORT_ID"; // Channel id logs information

const DURATIONS = {
  "1min": { label: "1 Minute (test)", ms: 1000 * 60 },
  "1h": { label: "1 Hour", ms: 1000 * 60 * 60 },
  "5h": { label: "5 Hours", ms: 1000 * 60 * 60 * 5 },
  "1w": { label: "1 Week", ms: 1000 * 60 * 60 * 24 * 7 },
  "1mo": { label: "1 Month", ms: 1000 * 60 * 60 * 24 * 30 },
  perm: { label: "Permanent", ms: null }, // no ms means it never expires
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Manage the bot's blacklist.")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a user to the blacklist.")
        .addUserOption((opt) =>
          opt.setName("user").setDescription("User to block").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("reason")
            .setDescription("Reason for the block")
            .setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("duration")
            .setDescription("How long should the block last?")
            .setRequired(true)
            .addChoices(
              { name: "🧪 1 Minute (test)", value: "1min" },
              { name: "⏱️ 1 Hour", value: "1h" },
              { name: "⏱️ 5 Hours", value: "5h" },
              { name: "📅 1 Week", value: "1w" },
              { name: "📅 1 Month", value: "1mo" },
              { name: "🔒 Permanent", value: "perm" },
            ),
        )
        .addStringOption((opt) =>
          opt
            .setName("image")
            .setDescription("Image/video URL as evidence (optional)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a user from the blacklist.")
        .addUserOption((opt) =>
          opt
            .setName("user")
            .setDescription("User to unblock")
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("Show all users on the blacklist."),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: `🔒 **Access denied**\n> This command is exclusive to the bot developer.`, // owner-only, ignores the Administrator permission check
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand();
    const database = getData("blacklist", GLOBAL_KEY) || { users: {} };

    // ── ADD ────────────────────────────────────────────────
    if (subcommand === "add") {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const durationKey = interaction.options.getString("duration");
      const proof = interaction.options.getString("image") || null;

      const duration = DURATIONS[durationKey];

      if (database.users[user.id]) {
        return interaction.reply({
          content: `⚠️ **User already blocked**\n> **${user.tag}** is already on the blacklist.`,
          ephemeral: true,
        });
      }

      if (proof) {
        try {
          new URL(proof); // validate it's a real URL before saving/sending
        } catch {
          return interaction.reply({
            content: `❌ **Invalid URL**\n> The proof must be a valid link starting with **http** or **https**.`,
            ephemeral: true,
          });
        }
      }

      const guildMember = await interaction.guild.members
        .fetch(user.id)
        .catch(() => null); // null if the user isn't in this guild
      const now = Date.now();
      const expiresAt = duration.ms ? now + duration.ms : null; // null = permanent
      const expiresText = expiresAt
        ? `<t:${Math.floor(expiresAt / 1000)}:R> (<t:${Math.floor(expiresAt / 1000)}:F>)`
        : "Never — 🔒 Permanent";

      database.users[user.id] = {
        reason,
        proof,
        expiresAt,
        durationLabel: duration.label,
        addedBy: interaction.user.id,
        addedAt: new Date(now).toISOString(),
      };

      setData("blacklist", GLOBAL_KEY, database);

      // ── DM to the user ──────────────────────────────────────
      try {
        const dmEmbed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle("🚫 You have been added to the blacklist")
          .setDescription(
            "You have been blocked from the bot. You will no longer be able to use any command.",
          )
          .addFields(
            { name: "📝 Reason", value: reason, inline: false },
            { name: "⏳ Duration", value: duration.label, inline: true },
            { name: "📅 Expires", value: expiresText, inline: false },
          )
          .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setTimestamp();

        await user.send({ embeds: [dmEmbed] });
      } catch {} // user may have DMs closed, fail silently

      // ── Embed to the logs channel ─────────────────────────────
      const logsChannel = await client.channels
        .fetch(ID_CHANEL_LOGS)
        .catch(() => null);
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle("🚫 New user on the Blacklist")
          .setColor("Green")
          .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
          .addFields(
            {
              name: "👤 User",
              value: [
                `> **Name:** ${user.tag}`,
                `> **ID:** \`${user.id}\``,
                `> **Mention:** <@${user.id}>`,
                `> **Account created:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
                guildMember
                  ? `> **In server since:** <t:${Math.floor(guildMember.joinedTimestamp / 1000)}:F>`
                  : `> **In server:** Not in this server`,
              ].join("\n"),
              inline: false,
            },
            {
              name: "📋 Block details",
              value: [
                `> 📝 **Reason:** ${reason}`,
                `> ⏳ **Duration:** ${duration.label}`,
                `> 📅 **Expires:** ${expiresText}`,
                proof
                  ? `> 🔗 **Proof:** [View here](${proof})`
                  : `> 🔗 **Proof:** Not provided`,
              ].join("\n"),
              inline: false,
            },
            {
              name: "🛡️ Added by",
              value: [
                `> **Name:** ${interaction.user.tag}`,
                `> **ID:** \`${interaction.user.id}\``,
                `> **Date:** <t:${Math.floor(now / 1000)}:F>`,
              ].join("\n"),
              inline: false,
            },
          )
          .setImage(proof || null)
          .setFooter({
            text: "Blacklist System",
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        await logsChannel.send({ embeds: [logEmbed] });
      }

      // ── Reply to the admin ─────────────────────────────────
      const responseEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🚫 User added to the Blacklist")
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          {
            name: "👤 User",
            value: [`> **Name:** ${user.tag}`, `> **ID:** \`${user.id}\``].join(
              "\n",
            ),
            inline: false,
          },
          {
            name: "📋 Details",
            value: [
              `> 📝 **Reason:** ${reason}`,
              `> ⏳ **Duration:** ${duration.label}`,
              `> 📅 **Expires:** ${expiresText}`,
              proof
                ? `> 🔗 **Proof:** [View here](${proof})`
                : `> 🔗 **Proof:** Not provided`,
            ].join("\n"),
            inline: false,
          },
        )
        .setFooter({
          text: `Added by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      return interaction.reply({ embeds: [responseEmbed], ephemeral: true });
    }

    // ── REMOVE ────────────────────────────────────────────────
    if (subcommand === "remove") {
      const user = interaction.options.getUser("user");

      if (!database.users[user.id]) {
        return interaction.reply({
          content: `⚠️ **User not found**\n> **${user.tag}** is not on the blacklist.`,
          ephemeral: true,
        });
      }

      const previousInfo = database.users[user.id]; // keep a copy for the log/reply before deleting

      delete database.users[user.id];

      setData("blacklist", GLOBAL_KEY, database);

      // ── Embed to the logs channel ─────────────────────────────
      const logsChannel = await client.channels
        .fetch(ID_CHANEL_LOGS)
        .catch(() => null);
      if (logsChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle("✅ User removed from the Blacklist")
          .setColor("Green")
          .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
          .addFields(
            {
              name: "👤 User",
              value: [
                `> **Name:** ${user.tag}`,
                `> **ID:** \`${user.id}\``,
              ].join("\n"),
              inline: false,
            },
            {
              name: "📋 Previous block",
              value: [
                `> 📝 **Reason:** ${previousInfo.reason}`,
                `> ⏳ **Duration:** ${previousInfo.durationLabel}`,
                `> 📅 **Added on:** <t:${Math.floor(new Date(previousInfo.addedAt).getTime() / 1000)}:F>`,
              ].join("\n"),
              inline: false,
            },
            {
              name: "🛡️ Removed by",
              value: [
                `> **Name:** ${interaction.user.tag}`,
                `> **Date:** <t:${Math.floor(Date.now() / 1000)}:F>`,
              ].join("\n"),
              inline: false,
            },
          )
          .setFooter({
            text: "Blacklist System",
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        await logsChannel.send({ embeds: [logEmbed] });
      }

      const removedEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ User removed from the Blacklist")
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          {
            name: "👤 User",
            value: [`> **Name:** ${user.tag}`, `> **ID:** \`${user.id}\``].join(
              "\n",
            ),
            inline: false,
          },
          {
            name: "📋 Previous block",
            value: [
              `> 📝 **Reason:** ${previousInfo.reason}`,
              `> ⏳ **Duration:** ${previousInfo.durationLabel}`,
            ].join("\n"),
            inline: false,
          },
        )
        .setFooter({
          text: `Removed by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      return interaction.reply({ embeds: [removedEmbed], ephemeral: true });
    }

    // ── LIST ─────────────────────────────────────────────────
    if (subcommand === "list") {
      const entries = Object.entries(database.users);

      if (entries.length === 0) {
        return interaction.reply({
          content: `✅ **Empty blacklist**\n> There are currently no blocked users.`,
          ephemeral: true,
        });
      }

      const list = entries
        .map(([id, info], i) => {
          const expiresText = info.expiresAt
            ? `<t:${Math.floor(info.expiresAt / 1000)}:R>`
            : "🔒 Permanent";

          return [
            `**${i + 1}.** <@${id}> — \`${id}\``,
            `> 📝 **Reason:** ${info.reason}`,
            `> ⏳ **Duration:** ${info.durationLabel} — Expires: ${expiresText}`,
            info.proof
              ? `> 🔗 **Proof:** [View here](${info.proof})`
              : `> 🔗 **Proof:** Not provided`,
          ].join("\n");
        })
        .join("\n\n"); // blank line between each entry

      const listEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle(
          `🚫 Blacklist — ${entries.length} user${entries.length > 1 ? "s" : ""} blocked`,
        )
        .setDescription(list)
        .setFooter({
          text: "Blacklist System",
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      return interaction.reply({ embeds: [listEmbed], ephemeral: true });
    }
  },
};
