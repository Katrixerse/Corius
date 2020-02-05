const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                message.channel.send(`__**What would you like to do?**__\n\`\`\`Enable modlogs (currently ${row.logsEnabled == "true" ? "enabled" : "disabled"}) (type 1)\nDisable modlogs (type 2)\nChange the channel (currently set to ${row.logsChannel}) (type 3) (type exit to cancel)\`\`\``).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        if (response == "1") {
                            if (row.logsEnabled == "true") return funcs.send(`Modlogs are already enabled!`);
                            con.query(`UPDATE guildSettings SET logsEnabled ="true" WHERE guildId = ${message.guild.id}`);
                            funcs.send(`Modlogs enabled!`);
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            //if (row.logsEnabled !== "true") return;
                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                            if (!finder) return;
                            let embed = new RichEmbed()
                                .setTitle(`Modlogs Enabled.`)
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
                            if (row.logsEnabled == "false") return funcs.send(`Modlogs are not enabled!`);
                            con.query(`UPDATE guildSettings SET logsEnabled ="false" WHERE guildId = ${message.guild.id}`);
                            funcs.send(`Modlogs disabled!`);
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            if (row.logsEnabled !== "true") return;
                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                            if (!finder) return;
                            let embed = new RichEmbed()
                                .setTitle(`Modlogs Disabled.`)
                                .setTimestamp()
                                .setAuthor(message.author.username, message.author.avatarURL)
                                .setThumbnail(bot.user.avatarURL)
                                .setColor(funcs.rc())
                                .addField(`Disabled by:`, message.author.username)
                                .addField(`Disabled at`, message.createdAt.toDateString())
                                .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                .addField(`Message:`, `[JumpTo](${message.url})`);
                            message.guild.channels.get(finder.id).send(embed);
                        } else if (response == "3") {
                            message.channel.send(`__**Which channel would you like to set the mod logs channel to?**__`).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    const channel = response.array()[0].content;
                                    const check = message.guild.channels.find(c => c.name == channel);
                                    if (!check) return funcs.send("Not a valid channel!");
                                    if (row.logsChannel == check.name) return funcs.send(`Mod logs channel already set to ${check.name}!`);
                                    con.query(`UPDATE guildSettings SET logsChannel ="${check.name}" WHERE guildId = ${message.guild.id}`);
                                    funcs.send(`Channel updated!`, false);
                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                    if (row.logsEnabled !== "true") return;
                                    let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                    if (!finder) return;
                                    let embed = new RichEmbed()
                                        .setTitle(`Mod logs Channel Updated.`)
                                        .setTimestamp()
                                        .setAuthor(message.author.username, message.author.avatarURL)
                                        .setThumbnail(bot.user.avatarURL)
                                        .setColor(funcs.rc())
                                        .addField(`Updated by:`, message.author.username)
                                        .addField(`Updated at`, message.createdAt.toDateString())
                                        .addField(`Updated to:`, check.name)
                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                        .addField(`Message:`, `[JumpTo](${message.url})`);
                                    message.guild.channels.get(finder.id).send(embed);
                                }).catch((e) => {
                                    funcs.send(`You ran out of time or an error occured!`);
                                    console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                });
                            });
                        } else {
                            funcs.send(`Command canceled.`);
                        }
                    }).catch((e) => {
                        funcs.send(`You ran out of time or an error occured!`);
                        console.log(`Error: ${e.message} in guild ${message.guild.name} command modlogs`);
                    });
                });
            });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "modlogs",
    aliases: ["ml"],
    usage: "Use this command to manage mod logs.",
    commandCategory: "moderation",
    cooldownTime: '5'
};