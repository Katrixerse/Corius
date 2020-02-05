module.exports.run = (bot, message, args, funcs) => {
  message.channel.send(`https://discordapp.com/api/oauth2/authorize?client_id=491699193585467393&permissions=506850678&scope=bot`);
};

module.exports.config = {
  name: "invite",
  aliases: ["inv"],
  usage: "Get an invite for the bot.",
  commandCategory: "miscellaneous",
  cooldownTime: '5'
};
