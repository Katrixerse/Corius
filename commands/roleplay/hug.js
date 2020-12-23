const { MessageEmbed} = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to hug!`);
      if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you can hug yourself..`);
      let embed = new MessageEmbed()
        .setImage("https://68.media.tumblr.com/4385f81b08e9a3377f0ef64e4e974735/tumblr_o97ertfVfU1vp16bjo1_500.gif")
        .setColor(funcs.rc())
        .setTitle(`${whotto.user.username}, you got a hug from ${message.author.username}, uwu owo.`);
      message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "hug",
  aliases: [],
  usage: "Use this command to hug somebody.",
  cooldownTime: '5',
commandCategory: "roleplay"
};