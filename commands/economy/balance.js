function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const { RichEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
  con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, row) => {
    if (row[0].economy == "false") return;
    try {
      let whoto = message.mentions.members.first() || message.member;
      con.query(`SELECT * FROM guildCash WHERE guildId = "${message.guild.id}" AND userId = "${whoto.id}"`, (e, row2) => {
        if (!row2 || row2.length == 0) return funcs.send(`User does not have any money.`);
        let networth = row2[0].userCash;
        const embed = new RichEmbed()
          .setAuthor(whoto.user.tag, whoto.user.avatarURL)
          .setColor(funcs.rc())
          .setFooter(bot.user.username)
          .addField(`Cash:`, `$` + numberWithCommas(networth))
          .addField(`Banked cash:`, `$` + numberWithCommas(row2[0].userBankedCash))
          .setThumbnail(whoto.user.avatarURL);
        message.channel.send(embed);
      });
    } catch (e) {
      console.error;
      funcs.send(`Oh no, an error occurred!\n${e.message}`);
    }
  });
};

module.exports.config = {
  name: "balance",
  aliases: ['bal'],
  usage: "Use this command to see somebody's balance.",
  commandCategory: "economy",
  cooldownTime: '3'
};