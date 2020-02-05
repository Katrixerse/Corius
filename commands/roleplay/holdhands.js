const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to kiss!`);
      if (whotto.id == message.author.id) return funcs.send(`Please mention somebody to hold their hands!`);
      let embed = new RichEmbed()
        .setImage("https://media1.tenor.com/images/47d18b56a850217a46b517da4325d132/tenor.gif?itemid=11496625")
        .setColor(funcs.rc())
        .setTitle(`${whotto.user.username}, ${message.author.username} held your hands uwu owo.`);
      message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "holdhands",
  aliases: [],
  usage: "Use this command to hold somebody's hands.",
  cooldownTime: '5',
commandCategory: "roleplay"
};