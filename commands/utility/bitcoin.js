const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bitcoin")
        .setDescription("Affiche la valeur actuelle du Bitcoin avec quelques infos supplémentaires."),

    async execute(interaction) {
        try {
            await interaction.deferReply(); // Évite les erreurs dues aux délais

            // Récupération des données depuis l'API CoinGecko
            const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
                params: {
                    ids: "bitcoin",
                    vs_currencies: "usd",
                    include_market_cap: true,
                    include_24hr_vol: true,
                    include_24hr_change: true
                }
            });

            const btcData = response.data.bitcoin;

            // Formater les nombres pour les rendre plus lisibles
            const price = btcData.usd.toLocaleString("en-US", { minimumFractionDigits: 2 });
            const marketCap = btcData.usd_market_cap.toLocaleString("en-US", { minimumFractionDigits: 0 });
            const volume = btcData.usd_24h_vol.toLocaleString("en-US", { minimumFractionDigits: 0 });
            const change24h = btcData.usd_24h_change.toFixed(2);

            // Définir la couleur en fonction de l'évolution du prix
            const color = change24h >= 0 ? 0x00ff00 : 0xff0000;

            // Créer l'embed pour un affichage plus propre
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle("💰 Prix actuel du Bitcoin")
                .setDescription(`Voici les dernières informations sur le BTC/USD`)
                .addFields(
                    { name: "📈 Prix actuel", value: `$${price} USD`, inline: true },
                    { name: "🔄 Variation (24h)", value: `${change24h}%`, inline: true },
                    { name: "💰 Capitalisation boursière", value: `$${marketCap} USD`, inline: true },
                    { name: "📊 Volume (24h)", value: `$${volume} USD`, inline: true }
                )
                .setFooter({ text: "Source: CoinGecko | Actualisé en temps réel" });

            // Envoyer la réponse
            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error("❌ Erreur lors de la récupération du prix du Bitcoin :", error);
            await interaction.followUp({ content: "Une erreur est survenue en récupérant les données du Bitcoin. Réessaie plus tard !", ephemeral: true });
        }
    },
};