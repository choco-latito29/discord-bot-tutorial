const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { getData, setData } = require("../../Events/Client/dbManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Autopilot system.")
    .addSubcommand((cmd) =>
      cmd
        .setName("add")
        .setDescription("Add role.")
        .addStringOption((o) =>
          o.setName("type").setDescription("Guy").setRequired(true).addChoices(
            { name: "User", value: "users" }, // must match the "users" key in the data object
            { name: "Bots", value: "bots" },
          ),
        )
        .addRoleOption((o) =>
          o.setName("role").setDescription("Rol").setRequired(true),
        ),
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("delete")
        .setDescription("Delete Role.")
        .addStringOption((o) =>
          o.setName("type").setDescription("Guy").setRequired(true).addChoices(
            { name: "User", value: "users" }, // must match the "users" key in the data object
            { name: "Bots", value: "bots" },
          ),
        )
        .addRoleOption((o) =>
          o.setName("role").setDescription("Rol").setRequired(true),
        ),
    )
    .addSubcommand((cmd) =>
      cmd.setName("show").setDescription("See Autoroles."),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles), // only members who can manage roles see/use this command
  async execute(interaction) {
    await interaction.deferReply();

    const sub = interaction.options.getSubcommand(); // which subcommand was used: add / delete / show
    const guild = interaction.guild;
    const botMember = guild.members.me;
    const userMember = interaction.member;

    let data = getData("autorole", guild.id) || {
      users: [], // default structure if no config exists yet for this guild
      bots: [],
    };

    if (sub === "add") {
      const type = interaction.options.getString("type"); // "users" or "bots"
      const role = interaction.options.getRole("role");

      if (role.id === guild.id) {
        return interaction.editReply("❌ You can't use @everyone."); // @everyone's ID equals the guild ID
      }

      if (role.position >= botMember.roles.highest.position) {
        return interaction.editReply(
          "❌You cannot manage this role (it is above my role).", // bot can't assign roles higher than its own
        );
      }

      if (role.position >= userMember.roles.highest.position) {
        return interaction.editReply(
          "❌ You cannot configure that role (it is above your role).", // prevent privilege escalation
        );
      }

      if (role.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.editReply(
          "❌ You cannot configure roles with Administrator permissions.", // safety check, never auto-assign admin
        );
      }

      if (data[type].includes(role.id)) {
        return interaction.editReply("❌ That role is already configured.");
      }

      data[type].push(role.id);
      setData("autorole", guild.id, data); // persist the updated config

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ Autorole Added")
        .setDescription(`Role ${role} added to **${type}**`)
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }

    if (sub === "delete") {
      const type = interaction.options.getString("type");
      const role = interaction.options.getRole("role");

      if (!data[type].includes(role.id)) {
        return interaction.editReply("❌ This role is not configured.");
      }

      data[type] = data[type].filter((r) => r !== role.id); // remove the role from the list
      setData("autorole", guild.id, data);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🗑️ Autorole Removed")
        .setDescription(`Role ${role} removed from **${type}**.`)
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }

    if (sub === "show") {
      const usersRoles =
        data.users.length > 0
          ? data.users.map((id) => `<@&${id}>`).join("\n") // mention each configured role
          : "No role configured.";

      const botsRoles =
        data.bots.length > 0
          ? data.bots.map((id) => `<@&${id}>`).join("\n")
          : "No role configured.";

      const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("📋 Autorole Configuration")
        .addFields(
          { name: "👤 Users", value: usersRoles },
          { name: "🤖 Bots", value: botsRoles },
        )
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }
  },
};
