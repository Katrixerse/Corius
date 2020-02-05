module.exports.run = (bot, message, args, funcs) => {
    try {
        if (message.author.id !== "130515926117253122" && message.author.id !== "307472480627326987") return message.channel.send("Only bot owner can use this command.");
        bot.user.setPresence({
          game: {
            name: `in ${bot.guilds.size} servers | c!help`,
            type: "PLAYING"
          }
        });
        funcs.send(`Game reset!`);
      } catch (e) {
        console.error;
        funcs.send(`Oh no, an error occurred!\n${e.message}`);
      }
};

module.exports.config = {
  name: "resetgame",
  aliases: [],
  usage: "Resets the bots game back to default.",
  commandCategory: "owner",
  cooldownTime: '0'
};
