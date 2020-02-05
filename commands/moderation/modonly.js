const { RichEmbed } = require('discord.js');
module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT * FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
        const mods = rows.map(r => r.guildMods);
        const permissionNeeded = "BAN_MEMBERS";
        if (!message.member.hasPermission(permissionNeeded, false, true, true) && !mods.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command!`);
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.modOnly AS mo, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            message.channel.send(`__**WHat would you like to do?**__\n\`\`\`Enable modOnly (type 1)\nDisable modOnly (type 2)\nType exit to cancel.\`\`\``).then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    errors: ["time"],
                    time: 30000
                }).then((response) => {
                    response = response.array()[0].content;
                    if (response == "1") {
                        if (row.mo == "true") return funcs.send(`Modonly is already enabled!`);
                        con.query(`UPDATE guildSettings SET modOnly ="true" WHERE guildId ="${message.guild.id}"`);
                        funcs.send(`Modonly has been enabled. Only members with BAN_MEMBERS or higher will be able to use commands.`);
                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                        if (row.logsEnabled !== "true") return;
                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                        if (!finder) return;
                        let embed = new RichEmbed()
                            .setTitle(`Modonly Enabled.`)
                            .setTimestamp()
                            .setAuthor(message.author.username, message.author.avatarURL)
                            .setThumbnail(bot.user.avatarURL)
                            .setColor(funcs.rc())
                            .addField(`Enabled by:`, message.author.username)
                            .addField(`Enabled at`, message.createdAt.toDateString())
                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                            .addField(`Message:`, `[JumpTo](${message.url})`);
                        message.guild.channels.get(finder.id).send(embed);
                    } else if (response == "2") {
                        if (row.mo == "false") return funcs.send(`Modonly is not enabled!`);
                        con.query(`UPDATE guildSettings SET modOnly ="false" WHERE guildId ="${message.guild.id}"`);
                        funcs.send(`Modonly has been disabled.`);
                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                        if (row.logsEnabled !== "true") return;
                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                        if (!finder) return;
                        let embed = new RichEmbed()
                            .setTitle(`Modonly Disabled.`)
                            .setTimestamp()
                            .setAuthor(message.author.username, message.author.avatarURL)
                            .setThumbnail(bot.user.avatarURL)
                            .setColor(funcs.rc())
                            .addField(`Disabled by:`, message.author.username)
                            .addField(`Disabled at`, message.createdAt.toDateString())
                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                            .addField(`Message:`, `[JumpTo](${message.url})`);
                        message.guild.channels.get(finder.id).send(embed);
                    } else {
                        funcs.send(`Command canceled!`);
                    }
                }).catch((e) => {
                    funcs.send(`You ran out of time or an error occured!`);
                    console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                });
            });
        });
    });
};

module.exports.config = {
    name: "modonly",
    aliases: [],
    usage: "Use this command to enable modonly.",
    commandCategory: "moderation",
    cooldownTime: "0"
};
