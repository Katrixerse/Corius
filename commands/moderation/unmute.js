const { richEmbed } = require("discord.js");
module.exports.run = (bot, message, args, funcs, con) => {
    const permissionNeeded = "MANAGE_GUILD";
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
        let row1 = rows.map(r => r.guildMods);
        if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return funcs.send(`I do not have the permission MANAGE_ROLES to execute this command!`, true);
        const userToUnmute = message.mentions.members.first();
        if (!userToUnmute) return funcs.send(`You did not mention anybody to unmute!`);
        if (userToUnmute.highestRole.position >= message.member.highestRole.position) return funcs.send(`That user has the same or a higher position than you!`);
        if (userToUnmute.highestRole.position >= message.guild.me.highestRole.position) return funcs.send(`That user has the same or a higher position than me!`);
        con.query(`SELECT gc.caseNumber, gs.logsEnabled, gs.logsChannel, gs.muteRole FROM guildCasenumber AS gc LEFT JOIN guildSettings AS gs ON gs.guildId = gc.guildId WHERE gc.guildId ="${message.guild.id}"`, (e, row) => {
            row = row[0];
            const check = message.guild.roles.find(r => r.name == row.muteRole);
            if (!check) return funcs.send(`Could not find the default mute role for this guild (${row.muteRole}), it might have been delete. Use guildSettings to change it.`);
            if (check.position >= message.guild.me.highestRole.position) return funcs.send(`That role has the same or a higher position than me!`);
            if (userToUnmute.roles.filter(r => r.name == check.name).size == 0) return funcs.send(`User is not muted!`, true);
            userToUnmute.removeRole(check, `User unmuted!`);
            funcs.send(`User successfully unmuted!`, false);
            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
            const LogsEmbed = new richEmbed()
                .setTitle(`:loud_sound: Member Unmuted :loud_sound:`)
                .setAuthor(message.author.tag, message.author.avatarURL)
                .addField(`Member unmuted:`, userToUnmute.user.username)
                .addField(`Unmuted by:`, message.author.username)
                .addField(`Unmuted at:`, new Date().toDateString())
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
};

module.exports.config = {
    name: "unmute",
    aliases: [],
    usage: "Unmutes a user.",
    commandCategory: "moderation",
    cooldownTime: '0'
};