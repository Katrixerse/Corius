const {
    MessageEmbed
} = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.antiJoinEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            const permissionNeeded = "ADMINISTRATOR";
            if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
            row = row[0];
            message.channel.send(`__**What would you like to do?**__\n\`\`\`Enable antijoin (type 1)\nDisable antijoin (type 2)\nType exit to cancel.\`\`\``).then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    errors: ["time"],
                    time: 30000
                }).then((response) => {
                    response = response.array()[0].content;
                    if (response == "1") {
                        if (row.antiJoinEnabled == "true") return funcs.send(`Antijoin is already enabled!`);
                        con.query(`UPDATE guildSettings SET antiJoinEnabled ="true" WHERE guildId = ${message.guild.id}`);
                        funcs.send(`Antijoin has been enabled!`);
                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                        if (row.logsEnabled !== "true") return;
                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                        if (!finder) return;
                        let embed = new MessageEmbed()
                            .setTitle(`:warning: Antijoin Enabled. :warning:`)
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
                        if (row.antiJoinEnabled == "false") return funcs.send(`Antijoin is not enabled!`);
                        con.query(`UPDATE guildSettings SET antiJoinEnabled ="false" WHERE guildId = ${message.guild.id}`);
                        funcs.send(`Antijoin has been disabled!`);
                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                        if (row.logsEnabled !== "true") return;
                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                        if (!finder) return;
                        let embed = new MessageEmbed()
                            .setTitle(`:warning: Antijoin Disabled. :warning:`)
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
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "antijoin",
    aliases: ["aj"],
    usage: "Use this command to manage antijoin.",
    commandCategory: "moderation",
    cooldownTime: '0'
};