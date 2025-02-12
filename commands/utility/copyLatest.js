const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test_copy_latest")
    .setDescription("Copies the latest message from the latest forum post"),
  async execute(interaction) {
    try {
      // Find the bot-veille forum channel
      const forumChannel = interaction.client.channels.cache.find(
        (channel) => channel.name === "bot-veille" && channel.type === 15
      );

      if (!forumChannel) {
        return await interaction.reply({
          content: "Forum channel not found!",
          ephemeral: true
        });
      }

      // Get all threads and sort by creation date
      const threads = await forumChannel.threads.fetch();
      const latestThread = [...threads.threads.values()]
        .sort((a, b) => b.createdTimestamp - a.createdTimestamp)[0];

      if (!latestThread) {
        return await interaction.reply({
          content: "No forum posts found!",
          ephemeral: true
        });
      }

      // Get the latest message from the thread
      const messages = await latestThread.messages.fetch({ limit: 1 });
      const latestMessage = messages.first();

      if (!latestMessage) {
        return await interaction.reply({
          content: "No messages found in the latest thread!",
          ephemeral: true
        });
      }

      // Send the message content to the current channel
      await interaction.reply({
        content: `Latest message from "${latestThread.name}":\n\n${latestMessage.content}`
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error executing this command!",
        ephemeral: true
      });
    }
  },
}; 