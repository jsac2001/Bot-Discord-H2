const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a member for a specified duration.")
    .addUserOption(option => 
      option.setName("user")
        .setDescription("The user to mute")
        .setRequired(true))
    .addIntegerOption(option => 
      option.setName("duration")
        .setDescription("Duration in minutes")
        .setRequired(true)),
  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const duration = interaction.options.getInteger("duration");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply("❌ Vous n'avez pas la permission de mute.");
    }

    if (!member) {
      return interaction.reply("❌ Veuillez mentionner un utilisateur à mute.");
    }

    if (isNaN(duration) || duration <= 0) {
      return interaction.reply("❌ Spécifiez une durée en minutes. Exemple : `/mute @utilisateur 10`");
    }

    try {
      await member.timeout(duration * 60 * 1000, "Mute par un modérateur");
      interaction.reply(`🔇 **${member.user.tag}** a été mute pour ${duration} minutes.`);
    } catch (error) {
      console.error("❌ Erreur lors du mute :", error);
      interaction.reply("❌ Impossible de mute cet utilisateur. Vérifiez mes permissions !");
    }
  }
}; 