const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user.")
    .addUserOption(option => 
      option.setName("user")
        .setDescription("The user to get info about")
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const userInfo = `
👤 **Infos sur l'utilisateur :**
- **Nom d'utilisateur :** ${user.username}
- **ID :** ${user.id}
- **Rejoint le serveur :** ${new Date(member.joinedAt).toLocaleDateString()}
- **Compte créé le :** ${new Date(user.createdAt).toLocaleDateString()}
    `;
    interaction.reply(userInfo);
  }
};
