const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    let first = args[0];
    if (!first) return funcs.send(`You did not enter the first object to ship!`);
    let second = args[1];
    if (!second) return funcs.send(`You did not enter the second object to ship!`);
    let percentage = Math.floor(Math.random() * 100);
    let em = new MessageEmbed()
      .setTimestamp()
      .setTitle(`Ship`)
      .setDescription(`I ship ${first} and ${second} ${percentage}%!`)
      .setColor(funcs.rc());
    message.channel.send(em);
  } catch (e) {
    console.error;
    funcs.send(`Oh no, an error occurred!\n${e.message}`);
  }
};

module.exports.config = {
  name: "ship",
  aliases: [''],
  usage: "Ship two objects/people together",
  commandCategory: "fun",
  cooldownTime: "0"
};