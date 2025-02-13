const { SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the paused music."),
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild);
    if (!queue || !queue.paused) return interaction.reply('❌ Aucune musique en pause.');

    queue.setPaused(false);
    interaction.reply('▶️ Musique reprise.');
  }
}; 