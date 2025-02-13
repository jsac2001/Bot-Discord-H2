const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { newsApiKey } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("news")
    .setDescription("Get the latest news."),
  async execute(interaction) {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=fr&apiKey=${newsApiKey}`;
      const response = await axios.get(url);
      const articles = response.data.articles;

      if (!articles.length) {
        return interaction.reply('Aucune actualité récente trouvée.');
      }

      let newsMessage = '**Voici les dernières actualités en France :**\n';
      articles.slice(0, 3).forEach((article, index) => {
        newsMessage += `\n**${index + 1}. ${article.title}**\n${article.description || 'Pas de description disponible.'}\n[Lire l\'article complet](${article.url})\n`;
      });

      interaction.reply(newsMessage);
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités :', error);
      interaction.reply('❌ Une erreur est survenue en essayant de récupérer les actualités.');
    }
  }
}; 