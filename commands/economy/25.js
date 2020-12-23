const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
  try {
    con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, settings) => {
      con.query(`SELECT * FROM guildCash WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row2) => {
        if (settings[0].economy == "false") return;
        if (!row2 || row2.length == 0 || row2[0].userCash == 0) return funcs.send(`You haven't earned any cash yet.`);
        let dice = Math.floor(Math.random() * 50 + 1);
        let num = parseInt(args.join(` `));
        let won = Math.round(num * 1.25);
        if (!num) return funcs.send(`Please provide a number to gamble!`);
        if (isNaN(num) || num <= 0) return funcs.send(`Not a valid number.`);
        if (!isFinite(num)) return funcs.send(`Not a valid number.`);
        if (num >= 100000) return funcs.send(`Number cannot be higher than 100,000.`);
        if (num > row2[0].userCash) return funcs.send(`Cannot bet a number higher than your balance.`);
        if (dice >= "25") {
          let embed = new MessageEmbed()
            .setTitle(`You have won!`)
            .addField(`Won amount:`, won + "$")
            .addField(`New money value:`, `${row2[0].userCash + won}$`)
            .setTimestamp()
            .setColor(funcs.rc());
          message.channel.send(embed);
          con.query(`UPDATE guildCash SET userCash = ${row2[0].userCash + won} WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`);
        } else {
          let embed = new MessageEmbed()
            .setTitle(`You have lost!`)
            .addField(`Lost amount:`, won + "$")
            .addField(`New money value:`, `${row2[0].userCash - won}$`)
            .setTimestamp()
            .setColor(funcs.rc());
          message.channel.send(embed);
          con.query(`UPDATE guildCash SET userCash = ${row2[0].userCash - won} WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`);
        }
      });
    });
  } catch (err) {
    console.log(err);
    funcs.send(`Oh no! An error occurred! \`${err.message}\`.`);
  }
};

module.exports.config = {
  name: "25",
  aliases: [],
  usage: "Use this command to gamble.",
  commandCategory: "economy",
  cooldownTime: '3'
};