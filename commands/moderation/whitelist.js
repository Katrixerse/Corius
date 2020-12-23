const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            const permissionNeeded = "ADMINISTRATOR";
            if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
            const user = message.mentions.members.first();
            if (!user) return funcs.send(`You need to mention a user to whitelist!`, true);
            if (user.highestRole.position >= message.member.highestRole.position) return funcs.send(`That user has the same position or a higher positon than you!`, true);
            con.query(`SELECT * FROM guildBlacklistedUsers WHERE guildId ="${message.guild.id}"`, (e, users) => {
                if (!users || users.length == 0) {
                    return funcs.send(`There are no blacklisted users in this guild!`, true);
                } else {
                    const check = users.filter(u => u.user == user.id);
                    if (check.length == 0) return funcs.send(`That user is not blacklisted!`);
                    con.query(`DELETE FROM guildBlacklistedUsers WHERE guildId ="${message.guild.id}" AND user ="${user.id}"`);
                    funcs.send(`User successfully whitelisted!`, false);
                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                    if (row.logsEnabled !== "true") return;
                    let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                    if (!finder) return;
                    let embed = new richEmbed()
                        .setTitle(`User Whitelisted.`)
                        .setTimestamp()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setThumbnail(bot.user.avatarURL)
                        .setColor(funcs.rc())
                        .addField(`User:`, user.user.tag)
                        .addField(`Whitelisted by:`, message.author.username)
                        .addField(`Whitelisted at`, message.createdAt.toDateString())
                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                        .addField(`Message:`, `[JumpTo](${message.url})`);
                    message.guild.channels.get(finder.id).send(embed);
                }
            });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "whitelist",
    aliases: ["wl"],
    usage: "Use this command to whitelist a user that has been blacklisted.",
    commandCategory: "moderation",
    cooldownTime: '0'
};