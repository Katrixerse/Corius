const { RichEmbed } = require("discord.js");
const moment = require("moment");
const ms = require("ms");

module.exports.run = (bot, message, args, funcs) => {
  const embed = new RichEmbed()
    .setColor(funcs.rc())
    .setTitle("Ping")
    .addField(":clock: Ping:", `${Math.round(bot.ping)}ms`)
    .addField(`:robot: Uptime:`, `${ms(bot.uptime)}`);
  message.channel.send(embed);
};

module.exports.config = {
  name: "ping",
  aliases: ["pong"],
  usage: "Check the status of the bot.",
  commandCategory: "miscellaneous",
  cooldownTime: "5"
};
