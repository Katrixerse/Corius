const { RichEmbed, version } = require("discord.js");
const ms = require('ms');

module.exports.run = (bot, message, args, funcs) => {
    try {
        const embed = new RichEmbed()
          .setColor(funcs.rc())
          .setTitle(':computer: Corius Stats')
          .setDescription('Corius\'s current statistics.')
          .addField('**__Bot:__**', `Uptime: ${ms(bot.uptime)}\nCommands: ${bot.commands.size}\nUsers/Channels/Servers:\n${bot.users.size.toLocaleString()}/${bot.channels.size.toLocaleString()}/${bot.guilds.size.toLocaleString()}`)
          .addField('**__Server:__**', `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MBS/1024MBS\nCPU: Intel(R) Xeon(R) Gold 6140 CPU @ 2.30GHz\nOS: Linux (x64)`)
          .addField('**__Versions:__**', `Node.js: ${process.version}\nDiscord.js: v${version}`)
        message.channel.send(embed);
      } catch (e) {
        console.error;
        funcs.send(`Oh no, an error occurred!\n${e.message}`);
      }
};

module.exports.config = {
  name: "botinfo",
  aliases: [""],
  usage: "Gives you the bots info.",
  commandCategory: "info",
  cooldownTime: '0'
};
