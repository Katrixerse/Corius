module.exports.run = (bot, message, args, funcs) => {
    funcs.send(`I currently have: ${bot.commands.size} commands.`);
};

module.exports.config = {
  name: "commandcount",
  aliases: ["ccount"],
  usage: "Get the total command count for the bot.",
  commandCategory: "miscellaneous",
  cooldownTime: '0'
};
