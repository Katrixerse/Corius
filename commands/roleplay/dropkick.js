const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    let whoto = message.mentions.members.first();
    if (!whoto) return funcs.send(`Please mention somebody to dropkick..`);
    const embed = new richEmbed()
      .setTitle("Drop Kicked")
      .setDescription(`${whoto.user.username}, you got a drop kick from ${message.author.username}!`)
      .setColor(funcs.rc())
      .setImage("https://media1.tenor.com/images/a72eff6ea423b438178defb24d613e46/tenor.gif?itemid=9412329")
      .setTimestamp();
    message.channel.send(embed);
  } catch (err) {
    console.log(err) 
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "dropkick",
  aliases: [],
  usage: "Use this command to dropkick somebody.",
  cooldownTime: '5',
  commandCategory: "roleplay"
};