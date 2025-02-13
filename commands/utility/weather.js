const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { meteoApiKey } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get the weather for a specified city.")
    .addStringOption(option => 
      option.setName("city")
        .setDescription("The city to get the weather for")
        .setRequired(true)),
  async execute(interaction) {
    const city = interaction.options.getString("city");

    try {
      const url = `https://api.meteo-concept.com/api/forecast/daily?token=${meteoApiKey}&insee=${encodeURIComponent(city)}`;
      const response = await axios.get(url);

      if (response.data.forecast && response.data.forecast.length > 0) {
        const forecast = response.data.forecast[0];
        const weatherMessage = `
🌦 **Météo pour ${city} :**
- **Température minimale :** ${forecast.tmin}°C
- **Température maximale :** ${forecast.tmax}°C
- **Prévisions :** ${forecast.weather}.
        `;
        interaction.reply(weatherMessage);
      } else {
        interaction.reply('❌ Je n\'ai pas trouvé de données météo pour cette ville.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo :', error);
      interaction.reply('❌ Une erreur est survenue en essayant de récupérer les données météo.');
    }
  }
}; 