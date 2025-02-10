const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bender_row")
    .setDescription("Dunno what it does")
    .addUserOption(option =>
      option
        .setName("target")
        .setDescription("The member to ban")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("The reason for banning")
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";

    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Confirm Ban")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    const orge = new ButtonBuilder()
      .setLabel("Qué ?")
      .setURL(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
      )
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(cancel, confirm, orge);

    await interaction.reply({
      content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
      components: [row]
    });
  }
};
