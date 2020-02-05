const { RichEmbed } = require("discord.js");
module.exports.run = (bot, message, args, funcs, con) => {
    const permissionNeeded = `MANAGE_GUILD`;
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
        let row1 = rows.map(r => r.guildMods);
        if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You are missing the ${permissionNeeded} permission to use this command!`, true);
        const user = message.mentions.members.first();
        if (!user) return funcs.send(`You didn't mention a user to display their punishments!`, true);
        if (user.user.bot) return funcs.send(`User cannot be a bot.`);
        con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`, (e, row) => {
            if (e) {
                console.log(e);
                con.query(`CREATE TABLE IF NOT EXISTS userPunishments (guildId TEXT, userId TEXT, warnings INTEGER, kicks INTEGER, mutes INTEGER, bans INTEGER, reports INTEGER)`);
                con.query(`INSERT INTO userPunishments (guildId, userId, warnings, kicks, mutes, bans, reports) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, user.id, 0, 0, 0, 0, 0]);
                return funcs.send(`User has no punishments!`);
            }
            if (row.length == 0) {
                con.query(`INSERT INTO userPunishments (guildId, userId, warnings, kicks, mutes, bans, reports) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, user.id, 0, 0, 0, 0, 0]);
                return funcs.send(`User has no punishments!`);
            } else {
                row = row[0];
                const embed = new RichEmbed()
                    .setAuthor(user.user.tag, message.author.avatarURL)
                    .setColor(funcs.rc())
                    .setFooter(bot.user.username)
                    .setDescription(`**Bans:** ${row.bans}\n**Kicks:** ${row.kicks}\n**Reports:** ${row.reports}\n**Warnings:** ${row.warnings}\n**Mutes:** ${row.mutes}`)
                    .setThumbnail(user.user.avatarURL);
                message.channel.send(embed);
            }
        });
    });
};

module.exports.config = {
    name: "punishments",
    aliases: ["pmns"],
    usage: "Allows you to see the punishments a user has gotten.",
    commandCategory: "moderation",
    cooldownTime: '0'
};