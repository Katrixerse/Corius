const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    let whotto = message.mentions.members.first();
    if (!whotto) return funcs.send(`Please mention somebody to bite!`);
    if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you can bite yourself..`);
    let embed = new RichEmbed()
      .setImage("https://i.pinimg.com/originals/a4/30/3c/a4303c3a2939c8075832e05a91d9076c.gif")
      .setTitle(`${whotto.user.username}, ${message.author.username} has bitten you!`)
      .setColor(funcs.rc());
    message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "bite",
  aliases: [],
  usage: "Use this command to bite somebody.",
  commandCategory: "roleplay",
  cooldownTime: '5'
};