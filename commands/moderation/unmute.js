const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a member.")
    .addUserOption(option => 
      option.setName("user")
        .setDescription("The user to unmute")
        .setRequired(true)),
  async execute(interaction) {
    const member = interaction.options.getMember("user");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply("❌ Vous n'avez pas la permission d'unmute.");
    }

    if (!member) {
      return interaction.reply("❌ Veuillez mentionner un utilisateur à unmute.");
    }

    if (member.communicationDisabledUntilTimestamp === null) {
      return interaction.reply("❌ Cet utilisateur n'est pas mute.");
    }

    try {
      await member.timeout(null);
      interaction.reply(`🔊 **${member.user.tag}** a été unmute.`);
    } catch (error) {
      console.error("❌ Erreur lors de l'unmute :", error);
      interaction.reply("❌ Impossible d'unmute cet utilisateur. Vérifiez mes permissions !");
    }
  }
}; 