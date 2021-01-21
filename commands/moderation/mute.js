const {
    richEmbed
} = require("discord.js");
const ms = require("ms");
const addEntry = require('../../handlers/addDbEntry');
module.exports.run = (bot, message, args, funcs, con) => {
    const permissionNeeded = "MANAGE_GUILD";
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
        let row1 = rows.map(r => r.guildMods);
        if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return funcs.send(`I do not have the permission MANAGE_ROLES to execute this command!`, true);
        const usage = new richEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor(funcs.rc())
            .setFooter(bot.user.username)
            .setDescription(`mute (memberToMute) (time followed by s (seconds), m (minutes), h (hours), or d (days)) (optional reason)`)
            .addField(`Example:`, `mute <@307472480627326987> 3h spamming too much`)
            .setThumbnail(message.author.avatarURL);
        const userToMute = message.mentions.members.first();
        if (!userToMute) return message.channel.send(usage);
        if (userToMute.highestRole.position >= message.member.highestRole.position) return funcs.send(`That user has the same or a higher position than you!`);
        if (userToMute.highestRole.position >= message.guild.me.highestRole.position) return funcs.send(`That user has the same or a higher position than me!`);
        const time = args[1];
        if (!time) return message.channel.send(usage);
        if (!time.endsWith("s") && !time.endsWith("m") && !time.endsWith("h") && !time.endsWith("d")) return funcs.send(`Not a valid time! (doesn't end in s, m, h, or d)`);
        const actualTime = parseInt(ms(time));
        if (parseInt(actualTime) < parseInt(ms("10s"))) return funcs.send(`Time cannot be lower than 10 seconds`);
        const reason = args.slice(2).join(` `) || "Moderator didn't provide a reason.";
        con.query(`SELECT muteRole FROM guildSettings WHERE guildId ="${message.guild.id}"`, (e, muteRole) => {
            muteRole = muteRole[0];
            const check = message.guild.roles.find(c => c.name == muteRole.muteRole);
            if (!check) return funcs.send(`Could not find the role that is currently set as the muted role (${muteRole.muteRole}). To edit it, use guildSettings.`, true);
            if (check.position >= message.member.highestRole.position) return funcs.send(`That role has the same position or a higher position than you!`);
            if (check.position >= message.guild.me.highestRole.position) return funcs.send(`That role has the same position or a higher position than me!`);
            if (userToMute.roles.filter(r => r.name == check.name).size > 0) return funcs.send(`That user already has that role!`);
            userToMute.addRole(check, `User has been muted.`);
            setTimeout(() => {
                if (userToMute.roles.filter(r => r.name == check.name).size == 0) return;
                userToMute.removeRole(check, `User unmuted!`).catch(() => { });
                funcs.send(`Unmuted ${userToMute.user.username} after ${ms(actualTime)}`);
            }, actualTime);
            funcs.send(`User has been successfully muted!`);
            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${userToMute.id}"`, async (e, row) => {
                if (row.length == 0) {
                    addEntry.addDbEntryUserId(message.guild.id, userToMute.id, 'mute');
                } else {
                    row = row[0];
                    con.query(`UPDATE userPunishments SET mutes = ${row.mutes + 1} WHERE guildId = ${message.guild.id} AND userId = ${userToMute.id}`);
                }
            });
            con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
                row = row[0];
                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                const LogsEmbed = new richEmbed()
                    .setTitle(`:mute: Member Muted :mute:`)
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .addField(`Member muted:`, userToMute.user.username)
                    .addField(`Muted by:`, message.author.username)
                    .addField(`Muted at:`, new Date().toDateString())
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
    name: "mute",
    aliases: ["mt"],
    usage: "Mutes a user.",
    commandCategory: "moderation",
    cooldownTime: '0'
};