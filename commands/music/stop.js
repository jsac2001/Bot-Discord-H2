const { SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the currently playing music."),
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild);
    if (!queue) return interaction.reply('❌ Aucune musique en cours.');

    queue.destroy();
    interaction.reply('🛑 Musique arrêtée.');
  }
}; 