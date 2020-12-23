const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to punch!`);
      if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you would want to punch yourself..`);
      let embed = new MessageEmbed()
        .setImage("https://media.giphy.com/media/fO1c8eUlcx2bS/giphy.gif")
        .setColor(funcs.rc())
        .setTitle(`Ouch! ${whotto.user.username}, you got punched by ${message.author.username}.`);
      message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "punch",
  aliases: [],
  usage: "Use this command to punch somebody.",
  cooldownTime: '5',
  commandCategory: "roleplay"
};