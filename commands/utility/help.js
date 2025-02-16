const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all available commands."),
  async execute(interaction) {
    const helpMessage = "📌 **Liste des commandes du bot :**\n\n"
                        + "🛠️ **Modération**\n"
                        + "`/mute @user X` → Mute un membre pour X minutes.\n"
                        + "`/unmute @user` → Unmute un membre.\n"
                        + "`/kick @user` → Expulse un membre.\n"
                        + "`/ban @user` → Bannit un membre.\n"
                        + "`/clear X` → Supprime X messages dans le chat.\n\n"
                        + "🎵 **Musique**\n"
                        + "`/play [titre/url]` → Joue une musique.\n"
                        + "`/pause` → Met en pause.\n"
                        + "`/resume` → Reprend la musique.\n"
                        + "`/stop` → Arrête la musique.\n"
                        + "`/skip` → Passe à la musique suivante.\n\n"
                        + "📢 **Autres**\n"
                        + "`/weather [ville]` → Donne la météo.\n"
                        + "`/bitcoin` → Affiche la valeur actuelle du bitcoin.\n"
                        + "`/articles` → Affiche les derniers articles d'un site.\n"
                        + "`/copy_latest` → Affiche le dernier message de #bot-veille.\n";
    await interaction.reply(helpMessage);
  }
};