const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bender_options")
    .setDescription("Use it to test different options")
    // .addChannelOption(option =>
    //   option.setName("channel").setDescription("The channel to echo into")
    // )
    // .addUserOption(option =>
    //   option
    //     .setName("target")
    //     .setDescription("The member to ban")
    //     .setRequired(true)
    // )
    // .addStringOption(option =>
    //   option.setName("reason").setDescription("The reason for banning")
    // )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether or not the echo should be ephemeral")
    ),
  async execute(interaction) {
    // // Ban Member
    // const target = interaction.options.getUser("target");
    // const reason =
    //   interaction.options.getString("reason") ?? "No reason provided";

    // await interaction.reply(`Banning ${target.username} for reason: ${reason}`);
    // await interaction.guild.members.ban(target);

    await interaction.reply({
      content: "Saucisse potentiellement privée",
      ephemeral: interaction.options.getBoolean("ephemeral"),
    });
  },
};
