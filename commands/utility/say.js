const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something.")
    .addStringOption(option => 
      option.setName("text")
        .setDescription("The text to say")
        .setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString("text");
    interaction.reply(text);
  }
}; 