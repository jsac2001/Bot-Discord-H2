const { SlashCommandBuilder } = require("discord.js");
const { Player } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song.")
    .addStringOption(option => 
      option.setName("query")
        .setDescription("The title or URL of the song to play")
        .setRequired(true)),
  async execute(interaction) {
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) return interaction.reply('❌ Vous devez être dans un salon vocal pour jouer de la musique.');

    const player = new Player(interaction.client);
    try {
      const searchResult = await player.search(query, {
        requestedBy: interaction.user
      });

      if (!searchResult || !searchResult.tracks.length) {
        return interaction.reply('❌ Aucun résultat trouvé pour votre requête.');
      }

      const queue = await player.createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel
        }
      });

      if (!queue.connection) await queue.connect(voiceChannel);

      queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
      interaction.reply(`🎶 Lecture en cours : **${searchResult.tracks[0].title}**`);
    } catch (error) {
      console.error('❌ Une erreur est survenue en essayant de lire la musique.', error);
      interaction.reply('❌ Une erreur est survenue en essayant de lire la musique.');
    }
  }
}; 