const { SlashCommandBuilder } = require("discord.js");
const Parser = require('rss-parser');
const parser = new Parser();
const feeds = require('../../data/rssFeeds.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('articles')
    .setDescription('Récupère les derniers articles d\'un flux RSS tech')
    .addStringOption(option =>
      option
        .setName('source')
        .setDescription('La source des articles')
        .setRequired(true)
        .addChoices(
          ...feeds.feeds.map(feed => ({
            name: feed.name,
            value: feed.url
          }))
        )
    )
    .addIntegerOption(option =>
      option
        .setName('nombre')
        .setDescription('Nombre d\'articles à récupérer (max 10)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(10)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const feedUrl = interaction.options.getString('source');
      const numberOfArticles = interaction.options.getInteger('nombre');

      const feed = await parser.parseURL(feedUrl);
      const articles = feed.items.slice(0, numberOfArticles);

      let response = `**Derniers articles de ${feed.title}**\n\n`;

      articles.forEach((article, index) => {
        response += `${index + 1}. [${article.title}](${article.link})\n`;
        if (article.contentSnippet) {
          const snippet = article.contentSnippet.split('\n')[0].slice(0, 100);
          response += `> ${snippet}...\n\n`;
        }
      });

      await interaction.editReply(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      await interaction.editReply('Une erreur est survenue lors de la récupération des articles.');
    }
  },
}; 