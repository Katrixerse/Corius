const { richEmbed } = require('discord.js');
const req = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
      try {
        const {
          body
        } = await req
            .get("https://catfact.ninja/breeds");
        let num = Math.floor(Math.random() * body.data.length);
        const embed = new richEmbed()
          .setTitle(`${body.data[num].breed}`)
          .addField(`Country:`, body.data[num].country)
          .addField(`Origin:`, body.data[num].origin)
          .addField(`Coat:`, body.data[num].coat)
          .addField(`Pattern:`, body.data[num].pattern)
          .setColor(funcs.rc());
        message.channel.send(embed);
      } catch (e) {
        console.error;
        funcs.send(`Oh no, an error occurred!\n${e.message}`);
      }
};

module.exports.config = {
  name: "randombreed",
  aliases: [],
  usage: "Shows you a random cat breed.",
  commandCategory: "fun",
  cooldownTime: '5'
};