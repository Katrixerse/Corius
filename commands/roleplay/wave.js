const { RichEmbed } = require("discord.js");
module.exports.run = async (bot, message, args, funcs) => {
  try {
    let whotto = message.mentions.members.first();
    if (!whotto) return funcs.send(`Please mention somebody to wave at!`);
    if (whotto.id == message.author.id)
      return funcs.send(`Ummm.. I am not sure if you can wave at yourself..`);
    let embed = new RichEmbed()
      .setImage("https://media.tenor.com/images/73ce6a152fdf3fa2645f6153c646c9b7/tenor.gif")
      .setTitle(`${whotto.user.username}, ${message.author.username} waved at you!`)
      .setColor(funcs.rc());
    message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "wave",
  aliases: [],
  usage: "Use this command to wave at somebody.",
  cooldownTime: '5',
  commandCategory: "roleplay"
};