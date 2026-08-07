const { getData } = require("../Client/dbManager");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const data = getData("autorole", member.guild.id);
    if (!data) return; // no autorole configured for this guild

    const botMember = member.guild.members.me;

    const roles = member.user.bot ? data.bots : data.users; // pick the right list depending on if it's a bot or a user
    if (!roles || roles.length === 0) return;

    for (const roleId of roles) {
      const role = member.guild.roles.cache.get(roleId);
      if (!role) continue; // role was deleted, skip it

      if (role.position >= botMember.roles.highest.position) continue; // bot can't assign roles above its own

      if (role.permissions.has("Administrator")) continue; // safety check, never auto-assign admin roles

      await member.roles.add(role).catch(() => {});
    }
  },
};
