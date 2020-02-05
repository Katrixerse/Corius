const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to tackle!`);
      if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you would want to tackle yourself..`);
      let embed = new RichEmbed()
        .setImage("https://i.pinimg.com/originals/4e/29/b9/4e29b9c52638e8114c14f7e55cef24a3.gif")
        .setColor(funcs.rc())
        .setTitle(`${whotto.user.username}, you got tackled by ${message.author.username}.`);
      message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "tackle",
  aliases: [],
  usage: "Use this command to tackle somebody.",
  cooldownTime: '5',
  commandCategory: "roleplay"
};