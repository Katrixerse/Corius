const { RichEmbed } = require("discord.js");
const addEntry = require('../../assets/exports/addDbEntry');

module.exports.run = (bot, message, args, funcs, con) => {
    const permissionNeeded = `MANAGE_GUILD`;
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
        let row1 = rows.map(r => r.guildMods);
        if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You are missing the ${permissionNeeded} permission to use this command!`, true);
        const userToWarn = message.mentions.members.first();
        if (!userToWarn) return funcs.send(`You did not mention anybody to warn!`);
        if (userToWarn.id == message.author.id) return funcs.send(`You cannot warn yourself, silly!`, true);
        if (userToWarn.user.bot) return funcs.send(`You cannot warn a bot!`, true);
        if (userToWarn.highestRole.position >= message.member.highestRole.position) return funcs.send(`You cannot warn that member. They have the same position as you, or a higher one.`, true);
        const reason = args.slice(1).join(` `);
        if (!reason) return funcs.send(`You did not specify a reason!`, true);
        con.query(`SELECT * FROM userWarns WHERE userWarns.guildId = "${message.guild.id}" AND userId = "${userToWarn.id}"`, (e, warns) => {
            if (warns !== undefined && warns.length >= 20) return funcs.send(`User has too many warns (20). Please consider deleting some and try again.`);
            con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${userToWarn.id}"`, (e, row) => {
                if (!row || row.length == 0) {
                    con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, userToWarn.id, reason, new Date().toDateString(), message.author.tag, userToWarn.user.username, 1]);
                } else {
                    con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, userToWarn.id, reason, new Date().toDateString(), message.author.tag, userToWarn.user.username, row[0].warnCount + 1]);
                }
            });
            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${userToWarn.id}"`, async (e, row) => {
                if (row.length == 0) {
                    addEntry.addDbEntryUserId(message.guild.id, userToWarn.id, 'warn');
                } else {
                    row = row[0];
                    con.query(`UPDATE userPunishments SET warnings = ${row.warnings + 1} WHERE guildId = ${message.guild.id} AND userId = ${userToWarn.id}`);
                }
            });
            funcs.send(`User has successfully been warned for ${reason}!`);
            con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
                row = row[0];
                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                const LogsEmbed = new RichEmbed()
                    .setTitle(`:warning: Member Warned :warning:`)
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .addField(`Member warned:`, userToWarn.user.username)
                    .addField(`Warned by:`, message.author.username)
                    .addField(`Warned at:`, new Date().toDateString())
                    .addField(`Reason:`, reason)
                    .addField(`Message:`, `[JumpTo](${message.url})`)
                    .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                    .setColor(funcs.rc())
                    .setThumbnail(message.author.avatarURL)
                    .setFooter(bot.user.username);
                if (row.logsEnabled !== "true") return;
                const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
                if (logsChannel === undefined) return;
                message.guild.channels.get(logsChannel.id).send(LogsEmbed);
            });
        });
    });
};

module.exports.config = {
    name: "warn",
    aliases: ["w"],
    usage: "Warns a user.",
    commandCategory: "moderation",
    cooldownTime: '0'
};