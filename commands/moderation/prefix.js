const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gp.prefix, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildPrefix AS gp ON cn.guildId = gp.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                row = row[0];
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                let prefix = args.join(` `);
                if (!prefix) return funcs.send(`You provided no prefix, how can I change it?`);
                let newprefix = prefix.replace(/[^\x00-\x7F]/g, "");
                if (newprefix.length < 1) funcs.send(`Prefix can't have ASCII characters.`);
                if (newprefix.length > 7) return funcs.send(`Prefix can't be longer than 7 characters.`);
                if (row.prefix == newprefix) return funcs.send(`Prefix is already set to ${newprefix}.`);
                con.query(`UPDATE guildPrefix SET prefix ="${prefix}" WHERE guildId = ${message.guild.id}`);
                funcs.send(`Prefix has been changed to ${newprefix}. To reset the prefix, mention me along with the message "prefix".`);
                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                if (row.logsEnabled !== "true") return;
                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                if (!finder) return;
                let embed = new RichEmbed()
                    .setTitle(`Prefix Changed.`)
                    .setTimestamp()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setThumbnail(bot.user.avatarURL)
                    .setColor(funcs.rc())
                    .addField(`Prefix:`, prefix)
                    .addField(`Changed by:`, message.author.username)
                    .addField(`Changed at`, message.createdAt.toDateString())
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
    name: "prefix",
    aliases: [],
    usage: "Use this command to change the prefix of the bot.",
    commandCategory: "moderation",
    cooldownTime: '5'
};