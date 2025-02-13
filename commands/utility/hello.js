const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello to the bot."),
  async execute(interaction) {
    interaction.reply(`Salut ${interaction.user.username} !`);
  }
}; 