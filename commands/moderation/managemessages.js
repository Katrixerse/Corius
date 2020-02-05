const { RichEmbed } = require("discord.js");
module.exports.run = async (bot, message, args, funcs, con) => {
    con.query(`SELECT gc.caseNumber, gs.logsEnabled, gs.logsChannel, gw.welcomeMessage, gw.welcomeMessageEnabled, gw.welcomeChannel, gw.leaveMessageEnabled, gw.leaveMessage, gw.leaveChannel FROM guildCasenumber AS gc LEFT JOIN guildSettings AS gs ON gs.guildId = gc.guildId LEFT JOIN guildWLSystem AS gw ON gw.guildId = gc.guildId WHERE gc.guildId ="${message.guild.id}"`, async (e, row) => {
        row = row[0];
        con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
            let row1 = rows.map(r => r.guildMods);
            const permissionNeeded = "MANAGE_GUILD";
            if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission to use this command.`, true);
            con.query(`SELECT welcomeMessage FROM guildWLSystem WHERE guildId ="${message.guild.id}"`, async (e, row) => {
                if (row.length == 0) {
                    await con.query(`INSERT INTO guildWLSystem (guildId, welcomeMessageEnabled, welcomeMessage, welcomeChannel, leaveMessageEnabled, leaveMessage, leaveChannel) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, "false", "Hello %NAME%. Welcome to %GUILDNAME%!", "none", "false", "Goodbye %NAME%. %NAME% left the guild.", "none"]);
                }
            });
            message.channel.send(`**__What would you like to do?__**\n\`\`\`Enable/Disable welcome messages (say 1)\nChange the welcome message (say changewm or 2)\nChange the welcome channel (type changewc or 3)\nEnable/Disable leave messages (say 4)\nChange the leave message (type changelm or 5)\nChange the leave channel (type changelc or 6)\n\n\nSay exit or 7 to cancel\`\`\``)
                .then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((resp) => {
                            if (!resp) return;
                            resp = resp.array()[0];
                            if (resp.content.toLowerCase() == 'enable' || resp.content.toLowerCase() == "1") {
                                if (row.welcomeMessageEnabled == 'false') {
                                    message.channel.send('**__Welcome messages are disabled would you like to enable them? (Please say enable)__**')
                                        .then(() => {
                                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                max: 1,
                                                time: 30000,
                                                errors: ['time'],
                                            })
                                                .then((resp) => {
                                                    if (!resp) return;
                                                    resp = resp.array()[0];
                                                    if (resp.content.toLowerCase() == 'enable') {
                                                        con.query(`UPDATE guildWLSystem SET welcomeMessageEnabled = 'true' WHERE guildId = '${message.guild.id}'`);
                                                        funcs.send('Welcome messages has been enabled (Please use c!managemessages then say 3 to change the message or 4 to change the channel)');
                                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                                        if (!finder) return;
                                                        let embed = new RichEmbed()
                                                            .setTitle(`Welcome Messages Enabled.`)
                                                            .setTimestamp()
                                                            .setThumbnail(bot.user.avatarURL)
                                                            .setColor(funcs.rc())
                                                            .addField(`Enabled by:`, message.author.username)
                                                            .addField(`Enabled at`, message.createdAt.toDateString())
                                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                                        message.guild.channels.get(finder.id).send(embed);
                                                    } else {
                                                        funcs.send('You have decided not to enable, command has been cancelled.');
                                                    }
                                                });
                                        });
                                } else {
                                    message.channel.send('**__Welcome messages are enabled would you like to disable them?__**')
                                        .then(() => {
                                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                max: 1,
                                                time: 30000,
                                                errors: ['time'],
                                            })
                                                .then((resp) => {
                                                    if (!resp) return;
                                                    resp = resp.array()[0];
                                                    if (resp.content.toLowerCase() == 'disable') {
                                                        con.query(`UPDATE guildWLSystem SET welcomeMessageEnabled = 'false' WHERE guildId = '${message.guild.id}'`);
                                                        funcs.send('Welcome messages has been disabled.');
                                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                                        if (!finder) return;
                                                        let embed = new RichEmbed()
                                                            .setTitle(`Welcome Messages Disabled.`)
                                                            .setTimestamp()
                                                            .setThumbnail(bot.user.avatarURL)
                                                            .setColor(funcs.rc())
                                                            .addField(`Disabled by:`, message.author.username)
                                                            .addField(`Disabled at`, message.createdAt.toDateString())
                                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                                        message.guild.channels.get(finder.id).send(embed);
                                                    } else {
                                                        funcs.send('You have decided not to disable command has been cancelled');
                                                    }
                                                });
                                        });
                                }
                            } else if (resp.content.toLowerCase() == 'changewm' || resp.content.toLowerCase() == "2") {
                                let embed = new RichEmbed()
                                    .setColor(funcs.rc())
                                    .setTimestamp()
                                    .setTitle(`What would you like your message to be?`)
                                    .setDescription(`Here are some placeholders:\n%NAME%, %PING%, %GUILDNAME%, %MEMBERCOUNT%`)
                                    .addField(`%NAME%`, `Displays the name of the author of the message.`)
                                    .addField(`%GUILDNAME%`, `Displays the name of the guild.`)
                                    .addField(`%PING%`, `Pings (mentions) the member that joined.`)
                                    .addField(`%MEMBERCOUNT%`, `Displays the membercount of the guild.`)
                                    .setFooter(`Example: (this is the default message) Hello %NAME%. Welcome to %GUILDNAME%!`);
                                message.channel.send(embed)
                                    .then(() => {
                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                            .then((welcomemess) => {
                                                if (!welcomemess) return;
                                                welcomemess = welcomemess.array()[0];
                                                let newprefix = welcomemess.content.replace(/[^\x00-\x7F]/g, "");
                                                if (newprefix.length < 1) return funcs.send(`Welcome message can't have ASCII characters.`);
                                                if (welcomemess.content.length > 500) return funcs.send(`Message can't be larger than 500 characters.`);
                                                con.query(`UPDATE guildWLSystem SET welcomeMessage = "${welcomemess.content}" WHERE guildId = ${message.guild.id}`);
                                                funcs.send(`Message has been set.`);
                                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                                if (!finder) return;
                                                let embed = new RichEmbed()
                                                    .setTitle(`Welcome Messaged Changed.`)
                                                    .setTimestamp()
                                                    .setThumbnail(bot.user.avatarURL)
                                                    .setColor(funcs.rc())
                                                    .addField(`Message:`, welcomemess.content)
                                                    .addField(`Changed by:`, message.author.username)
                                                    .addField(`Changed at`, message.createdAt.toDateString())
                                                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                    .addField(`Message:`, `[JumpTo](${message.url})`);
                                                message.guild.channels.get(finder.id).send(embed);
                                            }).catch((err) => {
                                                if (err.message === undefined) {
                                                    message.channel.send('You provided no input in the time limit, please try again.');
                                                } else {
                                                    console.log(err);
                                                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                }
                                            });
                                    });
                            } else if (resp.content.toLowerCase() == 'changewc' || resp.content.toLowerCase() == "3") {
                                message.channel.send(`**__Enter the channel you would like welcome messages to go in.__**`)
                                    .then(() => {
                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                            .then((c) => {
                                                if (!c) return;
                                                c = c.array()[0];
                                                let finder = message.guild.channels.find(c1 => c1.name == c.content);
                                                if (!finder) return send(`Couldn't find that channel.`);
                                                if (row.welcomeChannel == c.content.toLowerCase()) return funcs.send(`Channel is already set to ${c.content}.`);
                                                con.query(`UPDATE guildWLSystem SET welcomeChannel = "${c.content.toLowerCase()}" WHERE guildId = ${message.guild.id}`);
                                                funcs.send(`Channel has been set.`);
                                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                let f = message.guild.channels.find(c => c.name == row.logsChannel);
                                                if (!f) return;
                                                let embed = new RichEmbed()
                                                    .setTitle(`Welcome Messages Channel Set.`)
                                                    .setTimestamp()
                                                    .setThumbnail(bot.user.avatarURL)
                                                    .setColor(funcs.rc())
                                                    .addField(`Channel:`, finder.name)
                                                    .addField(`Set by:`, message.author.username)
                                                    .addField(`Set at`, message.createdAt.toDateString())
                                                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                    .addField(`Message:`, `[JumpTo](${message.url})`);
                                                message.guild.channels.get(f.id).send(embed);
                                            }).catch((err) => {
                                                if (err.message === undefined) {
                                                    message.channel.send('You provided no input in the time limit, please try again.');
                                                } else {
                                                    console.log(err);
                                                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                }
                                            });
                                    });
                            }
                            if (resp.content.toLowerCase() == "4") {
                                if (row.leaveMessageEnabled == 'false') {
                                    message.channel.send('**__Leave messages are disabled would you like to enable them? (Please say enable)__**')
                                        .then(() => {
                                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                max: 1,
                                                time: 30000,
                                                errors: ['time'],
                                            })
                                                .then((resp) => {
                                                    if (!resp) return;
                                                    resp = resp.array()[0];
                                                    if (resp.content.toLowerCase() == 'enable') {
                                                        con.query(`UPDATE guildWLSystem SET leaveMessageEnabled = 'true' WHERE guildId = '${message.guild.id}'`);
                                                        funcs.send('Leave messages has been enabled (Please use c!managemessages than say 5 to change the message or 6 to change the channel)');
                                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                                        if (!finder) return;
                                                        let embed = new RichEmbed()
                                                            .setTitle(`Welcome Messages Enabled.`)
                                                            .setTimestamp()
                                                            .setThumbnail(bot.user.avatarURL)
                                                            .setColor(funcs.rc())
                                                            .addField(`Enabled by:`, message.author.username)
                                                            .addField(`Enabled at`, message.createdAt.toDateString())
                                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                                        message.guild.channels.get(finder.id).send(embed);
                                                    } else {
                                                        funcs.send('You have decided not to enable command has been cancelled');
                                                    }
                                                });
                                        });
                                } else {
                                    message.channel.send('**__Leave messages are enabled would you like to disable them?__**')
                                        .then(() => {
                                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                max: 1,
                                                time: 30000,
                                                errors: ['time'],
                                            })
                                                .then((resp) => {
                                                    if (!resp) return;
                                                    resp = resp.array()[0];
                                                    if (resp.content.toLowerCase() == 'disable') {
                                                        con.query(`UPDATE guildWLSystem SET leaveMessageEnabled = 'false' WHERE guildId = '${message.guild.id}'`);
                                                        funcs.send('Leave messages has been disabled.');
                                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                                        if (!finder) return;
                                                        let embed = new RichEmbed()
                                                            .setTitle(`Leave Messages Disabled.`)
                                                            .setTimestamp()
                                                            .setThumbnail(bot.user.avatarURL)
                                                            .setColor(funcs.rc())
                                                            .addField(`Disabled by:`, message.author.username)
                                                            .addField(`Disabled at`, message.createdAt.toDateString())
                                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                                        message.guild.channels.get(finder.id).send(embed);
                                                    } else {
                                                        funcs.send('You have decided not to disable command has been cancelled');
                                                    }
                                                });
                                        });
                                }
                            } else if (resp.content.toLowerCase() == 'changelm' || resp.content.toLowerCase() == "5") {
                                let embed = new RichEmbed()
                                    .setColor(funcs.rc())
                                    .setTimestamp()
                                    .setTitle(`What would you like your message to be?`)
                                    .setDescription(`Here are some placeholders:\n%NAME%, %PING%, %GUILDNAME%, %MEMBERCOUNT%`)
                                    .addField(`%NAME%`, `Displays the name of the author of the message.`)
                                    .addField(`%GUILDNAME%`, `Displays the name of the guild.`)
                                    .addField(`%PING%`, `Pings (mentions) the member that joined.`)
                                    .addField(`%MEMBERCOUNT%`, `Displays the membercount of the guild.`)
                                    .setFooter(`Example: (this is the default message) Hello %NAME%. Welcome to %GUILDNAME%!`);
                                message.channel.send(embed)
                                    .then(() => {
                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                            .then((welcomemess) => {
                                                if (!welcomemess) return;
                                                welcomemess = welcomemess.array()[0];
                                                let newprefix = welcomemess.content.replace(/[^\x00-\x7F]/g, "");
                                                if (newprefix.length < 1) return funcs.send(`Welcome message can't have ASCII characters.`);
                                                if (welcomemess.content.length > 500) return duncs.send(`Message can't be larger than 500 characters.`);
                                                con.query(`UPDATE guildWLSystem SET leaveMessage = "${welcomemess.content}" WHERE guildId = ${message.guild.id}`);
                                                funcs.send(`Message has been set.`);
                                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                                if (!finder) return;
                                                let embed = new RichEmbed()
                                                    .setTitle(`Leave Messaged Changed.`)
                                                    .setTimestamp()
                                                    .setThumbnail(bot.user.avatarURL)
                                                    .setColor(funcs.rc())
                                                    .addField(`Message:`, welcomemess.content)
                                                    .addField(`Changed by:`, message.author.username)
                                                    .addField(`Changed at`, message.createdAt.toDateString())
                                                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                    .addField(`Message:`, `[JumpTo](${message.url})`);
                                                message.guild.channels.get(finder.id).send(embed);
                                            }).catch((err) => {
                                                if (err.message === undefined) {
                                                    message.channel.send('You provided no input in the time limit, please try again.');
                                                } else {
                                                    console.log(err);
                                                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                }
                                            });
                                    });
                            } else if (resp.content.toLowerCase() == 'changelc' || resp.content.toLowerCase() == "6") {
                                message.channel.send(`**__Enter the channel you would like leave messages to go in.__**`)
                                    .then(() => {
                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                            .then((c) => {
                                                if (!c) return;
                                                c = c.array()[0];
                                                let finder = message.guild.channels.find(c1 => c1.name == c.content);
                                                if (!finder) return funcs.send(`Couldn't find that channel.`);
                                                if (row.leaveChannel == c.content.toLowerCase()) return funcs.send(`Channel is already set to ${c.content}.`);
                                                con.query(`UPDATE guildWLSystem SET leaveChannel = "${c.content.toLowerCase()}" WHERE guildId = ${message.guild.id}`);
                                                funcs.send(`Channel has been set.`);
                                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                let f = message.guild.channels.find(c => c.name == row.logsChannel);
                                                if (!f) return;
                                                let embed = new RichEmbed()
                                                    .setTitle(`Leave Messages Channel Set.`)
                                                    .setTimestamp()
                                                    .setThumbnail(bot.user.avatarURL)
                                                    .setColor(funcs.rc())
                                                    .addField(`Channel:`, finder.name)
                                                    .addField(`Set by:`, message.author.username)
                                                    .addField(`Set at`, message.createdAt.toDateString())
                                                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                    .addField(`Message:`, `[JumpTo](${message.url})`);
                                                message.guild.channels.get(f.id).send(embed);
                                            }).catch((err) => {
                                                if (err.message === undefined) {
                                                    funcs.send('You provided no input in the time limit, please try again.');
                                                } else {
                                                    console.log(err);
                                                    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                }
                                            });
                                    });
                            } else if (resp.content.toLowerCase() == "exit" || resp.content.toLowerCase() == "7") {
                                funcs.send(`Command canceled.`);
                            }
                        }).catch((err) => {
                            if (err.message === undefined) {
                                funcs.send('You provided no input in the time limit, please try again.');
                            } else {
                                console.log(err);
                                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                            }
                        });
                });
        });
    });
};

module.exports.config = {
    name: "managemessages",
    aliases: [],
    usage: "Manage welcome leave messages for the bot.",
    commandCategory: "moderation",
    cooldownTime: '0'
};