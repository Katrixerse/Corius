module.exports.run = (bot, message, args, funcs) => {
    if (message.author.id !== "130515926117253122" && message.author.id !== "307472480627326987") return message.channel.send("Only bot owner can use this command.");
    try {
        bot.user.setPresence({
          game: {
            name: args.join(` `)
          }
        }).catch((e) => {
            funcs.send(`Oh no, an error occurred!\n${e.message}`);
        });
        funcs.send(`Game set to ${args.join(` `)}.`);
      } catch (e) {
        console.error;
        funcs.send(`Oh no, an error occurred!\n${e.message}`);
      }
};

module.exports.config = {
  name: "setgame",
  aliases: [],
  usage: "Allows you to set what game the bots playing.",
  commandCategory: "owner",
  cooldownTime: '0'
};
