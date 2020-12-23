const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            const permissionNeeded = "ADMINISTRATOR";
            if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
            const user = message.mentions.members.first();
            if (!user) return funcs.send(`You need to mention a user to blacklist!`, true);
            if (user.highestRole.position >= message.member.highestRole.position) return funcs.send(`That user has the same position or a higher positon than you!`, true);
            con.query(`SELECT * FROM guildBlacklistedUsers WHERE guildId ="${message.guild.id}"`, (e, users) => {
                if (users.length == 0) {
                    con.query(`INSERT INTO guildBlacklistedUsers (guildId, user) VALUES (?, ?)`, [message.guild.id, user.id]);
                } else {
                    if (users.length >= 20) return funcs.send(`Too many blacklisted users added! (20) Please consider whitelisting some and try again.`);
                    con.query(`INSERT INTO guildBlacklistedUsers (guildId, user) VALUES (?, ?)`, [message.guild.id, user.id]);
                }
                funcs.send(`User successfully blacklisted!`, false);
                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                if (row.logsEnabled !== "true") return;
                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                if (!finder) return;
                let embed = new MessageEmbed()
                    .setTitle(`User Blacklisted.`)
                    .setTimestamp()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setThumbnail(bot.user.avatarURL)
                    .setColor(funcs.rc())
                    .addField(`User:`, user.user.tag)
                    .addField(`Blacklisted by:`, message.author.username)
                    .addField(`Blacklisted at`, message.createdAt.toDateString())
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
    name: "blacklist",
    aliases: ["bl"],
    usage: "Use this command to blacklist a user and cancel any command they use.",
    commandCategory: "moderation",
    cooldownTime: '0'
};