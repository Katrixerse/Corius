const { RichEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            con.query(`SELECT * FROM guildGiveaways WHERE guildId = "${message.guild.id}"`, (e, giveaways) => {
                if (giveaways.length == 0) return funcs.send(`No giveaways to see!`);
                const embed = new RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setColor(funcs.rc())
                    .setFooter(bot.user.username)
                    .setThumbnail(message.author.avatarURL);
                let n = 0;
                giveaways.forEach(giveaway => {
                    embed.addField(`${n += 1}#:`, `Giveaway: ${giveaway.giveawayName}\nTime: ${require('ms')(giveaway.giveawayTime)}\nWinner count: ${giveaway.winnerCount}\nID: ${giveaway.timeId}`);
                });
                n = 0;
                message.channel.send(embed)
            });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "giveaways",
    aliases: [],
    usage: "Use this command to see the current giveaways.",
    commandCategory: "fun",
    cooldownTime: '0'
};