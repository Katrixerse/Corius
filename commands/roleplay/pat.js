const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to pat!`);
      if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you can pat yourself..`);
      let embed = new RichEmbed()
        .setImage("https://media.giphy.com/media/ARSp9T7wwxNcs/giphy.gif")
        .setColor(funcs.rc())
        .setTitle(`${whotto.user.username}, you got patted by ${message.author.username}, uwu owo.`);
      message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "pat",
  aliases: [],
  usage: "Use this command to pat somebody.",
  cooldownTime: '5',
  commandCategory: "roleplay"
};