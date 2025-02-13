const { SlashCommandBuilder } = require("discord.js");
const { Player } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the currently playing music."),
  async execute(interaction) {
    const queue = player.getQueue(interaction.guild);
    if (!queue || !queue.playing) return interaction.reply('❌ Aucune musique en cours.');

    const currentTrack = queue.current;
    queue.skip();
    interaction.reply(`⏭️ Musique passée : **${currentTrack.title}**`);
  }
}; 