const { MessageEmbed } = require("discord.js");
module.exports.run = (bot, message, args, funcs) => {
  const person = message.mentions.members.first();
  if (!person) return funcs.send(`You did not mention anybody to rate!`);
  const rate = Math.floor(Math.random() * 100) == 0 ? 1 : Math.floor(Math.random() * 100);
  const embed = new MessageEmbed()
    .setAuthor(message.author.tag, person.user.avatarURL)
    .setColor(funcs.rc())
    .setFooter(bot.user.username)
    .setDescription(`I would say ${person.user.username} is ${rate}% sexy!`)
    .setThumbnail(message.author.avatarURL);
  message.channel.send(embed);
};

module.exports.config = {
  name: "sexyrate",
  aliases: ['st'],
  usage: "Rates someone's sexyness.",
  commandCategory: "fun",
  cooldownTime: "0"
};
