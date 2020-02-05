const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    let whotto = message.mentions.members.first();
    if (!whotto) return funcs.send(`Please mention somebody to crush!`);
    if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you can have a crush on yourself..`);
    let embed = new RichEmbed()
      .setImage("https://68.media.tumblr.com/4385f81b08e9a3377f0ef64e4e974735/tumblr_o97ertfVfU1vp16bjo1_500.gif")
      .setColor(funcs.rc())
      .setTitle(`${whotto.user.username}, ${message.author.username} has a crush on you uwu owo`);
    message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "crush",
  aliases: [],
  usage: "Use this command to have a crush on somebody.",
  commandCategory: "roleplay",
  cooldownTime: '5'
};