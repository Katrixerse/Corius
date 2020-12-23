const { richEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to kiss!`);
      if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you can kiss yourself..`);
      let embed = new richEmbed()
        .setImage("https://otakustreintaneras.files.wordpress.com/2017/03/tumblr_ol4thvqn7f1twgfw0o4_500.gif")
        .setColor(funcs.rc())
        .setTitle(`${whotto.user.username}, you got a kiss from ${message.author.username}, uwu owo.`);
      message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "kiss",
  aliases: [],
  usage: "Use this command to kiss somebody.",
  cooldownTime: '5',
commandCategory: "roleplay"
};