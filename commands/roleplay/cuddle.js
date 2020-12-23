const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to cuddle!`);
      if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you can cuddle yourself..`);
      let embed = new richEmbed()
        .setImage("https://media.giphy.com/media/nTeeb8thSiS0U/giphy.gif")
        .setColor(funcs.rc())
        .setTitle(`${whotto.user.username}, you got a cuddle from ${message.author.username}, uwu owo.`);
      message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "cuddle",
  aliases: [],
  usage: "Use this command to cuddle somebody.",
  commandCategory: "roleplay",
  cooldownTime: '5'
};