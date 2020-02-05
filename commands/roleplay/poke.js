const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      let whotto = message.mentions.members.first();
      if (!whotto) return funcs.send(`Please mention somebody to poke!`);
      if (whotto.id == message.author.id) return funcs.send(`Ummm.. I am not sure if you would want to poke yourself..`);
      let embed = new RichEmbed()
        .setImage("https://thumbs.gfycat.com/FastCheerfulDolphin-small.gif")
        .setColor(funcs.rc())
        .setTitle(`${whotto.user.username}, you got poked by ${message.author.username}.`);
      message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "poke",
  aliases: [],
  usage: "Use this command to poke somebody.",
  cooldownTime: '5',
  commandCategory: "roleplay"
};