const {
    RichEmbed
} = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gd.events, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings AS gs ON gs.guildId = cn.guildId, guildDisabledSettings AS gd ON gd.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission to use this command.`, true);
                message.channel.send(`__**What would you like to do?**__\n\`\`\`Enable an event (type 1)\nDisable an event (type 2)\nType exit to cancel.\`\`\``).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        if (response == "1") {
                            message.channel.send(`__**Which event would you like to enable? (say exit to cancel) (say 1 to get a list of events)**__`).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    response = response.array()[0].content;
                                    if (response == "messageUpdate") {
                                        if (!row.events.includes(response)) return funcs.send(`That event is already enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events.split(response)}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully enabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Enabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Enabled by:`, message.author.username)
                                            .addField(`Enabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "messageDelete") {
                                        if (!row.events.includes(response)) return funcs.send(`That event is already enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events.split(response)}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully enabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Enabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Enabled by:`, message.author.username)
                                            .addField(`Enabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "memberUpdate") {
                                        if (!row.events.includes(response)) return funcs.send(`That event is already enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events.split(response)}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully enabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Enabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Enabled by:`, message.author.username)
                                            .addField(`Enabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "guildMemberAdd") {
                                        if (!row.events.includes(response)) return funcs.send(`That event is already enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events.split(response)}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully enabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Enabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Enabled by:`, message.author.username)
                                            .addField(`Enabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "guildMemberRemove") {
                                        if (!row.events.includes(response)) return funcs.send(`That event is already enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events.split(response)}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully enabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Enabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Enabled by:`, message.author.username)
                                            .addField(`Enabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "1") {
                                        const embed = new RichEmbed()
                                            .setAuthor(message.author.tag, message.author.avatarURL)
                                            .setColor(funcs.rc())
                                            .setFooter(bot.user.username)
                                            .addField(`messageUpdate`, `When a message gets edited`)
                                            .addField(`messageDelete`, `When a message gets deleted`)
                                            .addField(`memberUpdate`, `When a member is added/delete a role or changed their nickname`)
                                            .addField(`guildMemberAdd`, `When a member joins the guild`)
                                            .addField(`guildMemberRemove`, `When a member leaves the guild`)
                                            .setThumbnail(message.author.avatarURL);
                                        message.channel.send(embed);
                                    } else {
                                        funcs.send(`Command canceled.`);
                                    }
                                }).catch((e) => {
                                    funcs.send(`You ran out of time or an error occured!`);
                                    console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                });
                            });
                        } else if (response == "2") {
                            message.channel.send(`__**Which event would you like to disable? (say exit to cancel) (say 1 to get a list of events)**__`).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    response = response.array()[0].content;
                                    if (response == "messageUpdate") {
                                        if (row.events.includes(response)) return funcs.send(`That event is not enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events + response}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully disabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Disabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Disabled by:`, message.author.username)
                                            .addField(`Disabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "messageDelete") {
                                        if (row.events.includes(response)) return funcs.send(`That event is not enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events + response}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully disabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Disabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Disabled by:`, message.author.username)
                                            .addField(`Disabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "memberUpdate") {
                                        if (row.events.includes(response)) return funcs.send(`That event is not enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events + response}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully disabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Disabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Disabled by:`, message.author.username)
                                            .addField(`Disabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "guildMemberAdd") {
                                        if (row.events.includes(response)) return funcs.send(`That event is not enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events + response}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully disabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Disabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Disabled by:`, message.author.username)
                                            .addField(`Disabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "guildMemberRemove") {
                                        if (row.events.includes(response)) return funcs.send(`That event is not enabled!`);
                                        con.query(`UPDATE guildDisabledSettings SET events ="${row.events + response}" WHERE guildId = ${message.guild.id}`);
                                        funcs.send(`Event successfully disabled!`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new RichEmbed()
                                            .setTitle(`Event Disabled.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Event:`, response)
                                            .addField(`Disabled by:`, message.author.username)
                                            .addField(`Disabled at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "1") {
                                        const embed = new RichEmbed()
                                            .setAuthor(message.author.tag, message.author.avatarURL)
                                            .setColor(funcs.rc())
                                            .setFooter(bot.user.username)
                                            .addField(`messageUpdate`, `When a message gets edited`)
                                            .addField(`messageDelete`, `When a message gets deleted`)
                                            .addField(`memberUpdate`, `When a member is added/delete a role or changed their nickname`)
                                            .addField(`guildMemberAdd`, `When a member joins the guild\n:warning: Disabling this event will disable multiple features at once. Do not disable unless you know what you are doing. :warning:`)
                                            .addField(`guildMemberRemove`, `When a member leaves the guild\n:warning: Disabling this event will disable multiple features at once. Do not disable unless you know what you are doing. :warning:`)
                                            .setThumbnail(message.author.avatarURL);
                                        message.channel.send(embed);
                                    } else {
                                        funcs.send(`Command canceled.`);
                                    }
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
                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
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
    name: "manageevent",
    aliases: ["me"],
    usage: "Use this command to manage events.",
    commandCategory: "moderation",
    cooldownTime: '0'
};