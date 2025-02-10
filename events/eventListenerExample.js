const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    const triggerWords = ["Nicolas", "Nico", "Triau"];

    if (message.author.bot) return false;

    triggerWords.forEach((word) => {
      if (message.content.includes(word)) {
        message.reply("Est un déchet");
      }
    });

    if (message.author.id == 142335378064408585) {
      message.reply("Ta gueule");
    }
  },
};
