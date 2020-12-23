function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, row) => {
        if (row[0].economy == "false") return;
        try {
            const whoto = message.mentions.members.first() || message.member;
            con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${whoto.id}"`, (e, row2) => {
                if (!row2 || row2.length == 0) return funcs.send(`User does not have any money.`);
                row2 = row2[0];
                const networth = row2.userCash + row2.userBankedCash;
                const embed = new MessageEmbed()
                    .setAuthor(whoto.user.tag, whoto.user.avatarURL)
                    .setColor(funcs.rc())
                    .setFooter(bot.user.username)
                    .addField(`Cash:`, `$` + numberWithCommas(row2.userCash))
                    .addField(`Banked cash:`, `$` + numberWithCommas(row2.userBankedCash))
                    .addField(`Net-worth:`, `$` + numberWithCommas(networth))
                    .setThumbnail(whoto.user.avatarURL);
                message.channel.send(embed);
            });
        } catch (err) {
            console.log(err) 
            return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
          }
    });
};

module.exports.config = {
    name: "networth",
    aliases: ['nw'],
    usage: "Use this command to see somebody's net-worth.",
    commandCategory: "economy",
    cooldownTime: '2'
};