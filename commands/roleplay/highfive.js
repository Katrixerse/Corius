const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to highfive!`);
      if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you can highfive yourself..`);
      let embed = new MessageEmbed()
        .setImage("https://media.giphy.com/media/l0K4b2JSocmgkOpCU/giphy.gif")
        .setColor(funcs.rc())
        .setTitle(`${message.author.username} high-fived ${whotto.user.username}!`);
      message.channel.send(embed);
  } catch (e) {
    console.error;
    funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
  }
};

module.exports.config = {
  name: "highfive",
  aliases: [],
  usage: "Use this command to highfive somebody.",
  cooldownTime: '5',
  commandCategory: "roleplay"
};