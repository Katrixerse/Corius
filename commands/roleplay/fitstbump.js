const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to fistbump!`);
      if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you can fistbump yourself..`);
      let embed = new RichEmbed()
        .setImage("https://media.giphy.com/media/hfYnqeqVeO4pO/giphy.gif")
        .setColor(funcs.rc())
        .setTitle(`${message.author.username} fist bumped ${whotto.user.username}!`);
      message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "fistbump",
  aliases: [],
  usage: "Use this command to fistbump somebody.",
  cooldownTime: '5',
  commandCategory: "roleplay"
};