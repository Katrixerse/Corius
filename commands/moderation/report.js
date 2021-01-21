const { richEmbed } = require('discord.js');
const addEntry = require('../../handlers/addDbEntry');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                const person = message.mentions.members.first();
                if (!person || person.user.bot || person.id == message.author.id) return funcs.send(`Not a valid member to report!`);
                const reason = args.slice(1).join(` `);
                if (!reason) return funcs.send(`Not a valid reason!`);
                const channel = message.guild.channels.find(c => c.name.toLowerCase() == "reports");
                if (!channel) return funcs.send(`Could not find the "reports" channel!`);
                let embed1 = new richEmbed()
                    .setTitle(`Member Reported.`)
                    .setTimestamp()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setThumbnail(bot.user.avatarURL)
                    .setColor(funcs.rc())
                    .addField(`Member:`, person.user.tag)
                    .addField(`Reported by:`, message.author.username)
                    .addField(`Reported at`, message.createdAt.toDateString())
                    .addField(`Report reason:`, reason)
                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                    .addField(`Message:`, `[JumpTo](${message.url})`);
                message.guild.channels.get(channel.id).send(embed1);
                funcs.send(`Member reported for ${reason}!`, false);
                con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${person.id}"`, async (e, row) => {
                    if (row.length == 0) {
                        addEntry.addDbEntryUserId(message.guild.id, person.id, 'report');
                    }
                    row = row[0];
                    con.query(`UPDATE userPunishments SET reports = ${row.reports + 1} WHERE guildId = ${message.guild.id} AND userId = ${person.id}`);
                });
                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                if (row.logsEnabled !== "true") return;
                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                if (!finder) return;
                let embed = new richEmbed()
                    .setTitle(`Member Reported.`)
                    .setTimestamp()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setThumbnail(bot.user.avatarURL)
                    .setColor(funcs.rc())
                    .addField(`Member:`, person.user.tag)
                    .addField(`Reported by:`, message.author.username)
                    .addField(`Reported at`, message.createdAt.toDateString())
                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                    .addField(`Message:`, `[JumpTo](${message.url})`);
                message.guild.channels.get(finder.id).send(embed);
            });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "report",
    aliases: [],
    usage: "Use this command to report someone.",
    commandCategory: "moderation",
    cooldownTime: '5'
};