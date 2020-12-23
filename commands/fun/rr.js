const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    let stuff = [
      "Boom! :boom: You're dead! :skull:",
      "Wow you made it alive.. :upside_down:"
    ];
    const embed = new richEmbed()
      .setTitle("Rousian Roullete.")
      .setColor(funcs.rc())
      .setTimestamp()
      .setDescription(stuff[Math.floor(Math.random() * stuff.length)]);
    message.channel.send(embed);
  } catch (e) {
    console.error;
    funcs.send(`Oh no, an error occurred!\n${e.message}`);
  }
};

module.exports.config = {
  name: "rr",
  aliases: [],
  usage: "Play russian rulette.",
  commandCategory: "fun",
  cooldownTime: '5'
};