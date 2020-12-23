const { richEmbed } = require('discord.js');
const req = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    const {
      text
    } = await req
      .get('http://history.muffinlabs.com/date');
    const body = JSON.parse(text);
    const events = body.data.Events;
    const event = events[Math.floor(Math.random() * events.length)];
    const embed = new richEmbed()
      .setColor(funcs.rc())
      .setURL(body.url)
      .setTitle(`On this day (${body.date})...`)
      .setTimestamp()
      .setDescription(`${event.year}: ${event.text}`);
    return message.channel.send(embed).catch(console.error);
  } catch (e) {
    console.error;
    funcs.send(`Oh no, an error occurred!\n${e.message}`);
  }
};

module.exports.config = {
  name: "today",
  aliases: [''],
  usage: "Random Thing that happened today.",
  commandCategory: "fun",
  cooldownTime: "0"
};