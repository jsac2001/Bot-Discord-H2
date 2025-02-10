const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bender_response")
    .setDescription("Gives a simple reply, but has all types in comments"),
  async execute(interaction) {
    // await interaction.deferReply();
    // await wait(2_000);
    await interaction.reply("Saucisse");
    // await interaction.followUp("Deuxième Saucisse");
    // await interaction.editReply("Saucisse éditée");
    // await interaction.reply({ content: "Saucisse privée", ephemeral: true });
    // const message = await interaction.fetchReply();
    // console.log(message);
  }
};
