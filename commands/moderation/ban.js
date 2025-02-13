const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server.")
    .addUserOption(option => 
      option.setName("user")
        .setDescription("The user to ban")
        .setRequired(true)),
  async execute(interaction) {
    const member = interaction.options.getMember("user");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply("❌ Vous n'avez pas la permission de bannir.");
    }

    if (!member) {
      return interaction.reply("❌ Veuillez mentionner un utilisateur à bannir.");
    }

    if (!member.bannable) {
      return interaction.reply("❌ Je ne peux pas bannir cet utilisateur.");
    }

    try {
      await member.ban();
      interaction.reply(`✅ **${member.user.tag}** a été banni avec succès.`);
    } catch (error) {
      console.error('Erreur lors du bannissement :', error);
      interaction.reply('❌ Une erreur est survenue en essayant de bannir cet utilisateur.');
    }
  }
}; 