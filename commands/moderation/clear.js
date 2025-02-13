const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Supprime un certain nombre de messages dans le chat.")
    .addIntegerOption(option => 
      option.setName("amount")
        .setDescription("Nombre de messages à supprimer (entre 1 et 100)")
        .setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply("❌ Vous n'avez pas la permission de supprimer des messages.");
    }

    if (isNaN(amount) || amount <= 0 || amount > 100) {
      return interaction.reply("❌ Spécifiez un nombre de messages à supprimer (entre 1 et 100).");
    }

    try {
      const fetched = await interaction.channel.messages.fetch({ limit: amount });
      const filtered = fetched.filter(msg => (Date.now() - msg.createdTimestamp) < 14 * 24 * 60 * 60 * 1000);

      if (filtered.size === 0) {
        return interaction.reply("❌ Aucun message supprimable (plus de 14 jours).");
      }

      await interaction.channel.bulkDelete(filtered, true);
      interaction.reply(`🧹 **${filtered.size} messages ont été supprimés.**`).then(msg => {
        setTimeout(() => msg.delete(), 3000);
      });
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      interaction.reply("❌ Une erreur est survenue lors de la suppression des messages.");
    }
  }
}; 