const { SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the currently playing music."),
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild);
    if (!queue || !queue.playing) return interaction.reply('❌ Aucune musique en cours.');

    queue.setPaused(true);
    interaction.reply('⏸️ Musique mise en pause.');
  }
}; 