const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server.")
    .addUserOption(option => 
      option.setName("user")
        .setDescription("The user to kick")
        .setRequired(true)),
  async execute(interaction) {
    const member = interaction.options.getMember("user");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply("❌ Vous n'avez pas la permission de kick.");
    }

    if (!member) {
      return interaction.reply("❌ Veuillez mentionner un utilisateur à kick.");
    }

    if (!member.kickable) {
      return interaction.reply("❌ Je ne peux pas kick cet utilisateur.");
    }

    try {
      await member.kick();
      interaction.reply(`✅ **${member.user.tag}** a été kick avec succès.`);
    } catch (error) {
      console.error('Erreur lors du kick :', error);
      interaction.reply('❌ Une erreur est survenue en essayant de kick cet utilisateur.');
    }
  }
}; 