const { RichEmbed } = require("discord.js");

module.exports.run = (bot, message, args, funcs) => {
  const text = args.join(` `).substr(0, 1000) || "No text provided.";
  const embed = new RichEmbed().setDescription(text).setColor(funcs.rc());
  message.channel.send(embed);
};

module.exports.config = {
  name: "embed",
  aliases: ["em"],
  usage: "Put a message in an embed.",
  commandCategory: "fun",
  cooldownTime: '5'
};
