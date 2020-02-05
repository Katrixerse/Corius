const { RichEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT * FROM guildModerators WHERE guildId ="${message.guild.id}"`, async (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                if (!message.member.hasPermission(`MANAGE_GUILD`, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You need the MANAGE_GUILD permission to use this command.`);
                const usage = new RichEmbed()
                    .setTitle(`Purge Usage`)
                    .addField(`Example:`, `purge humans | bots (numberOfMessages) (optional: userToDeleteFrom (if humans option picked))`)
                    .setFooter(`Tip: this command will only delete messages from this channel.`)
                    .setColor(funcs.rc())
                    .setThumbnail(message.author.avatarURL)
                    .setTimestamp();
                const whoto = args[0];
                if (whoto !== "humans" && whoto !== "bots") return message.channel.send(usage);
                if (whoto == "humans") {
                    let topurge = args.slice(1).join(` `);
                    if (!topurge) return message.channel.send(usage);
                    let numtopurge = parseInt(topurge);
                    if (isNaN(numtopurge)) {
                        funcs.send(`Not a valid number to purge.`);
                        return message.channel.send(usage);
                    }
                    if (numtopurge >= 100) return funcs.send(`Max number of messages is 100.`);
                    if (numtopurge < 2) return funcs.send(`Min number of messages is 2.`);
                    //if (message.channel.messages.size < numtopurge) return funcs.send(`That number is higher than this channel's messages. (${message.channel.messages.size})`);
                    let user = message.mentions.members.first();
                    if (user !== undefined) {
                        message.channel.fetchMessages({
                            limit: numtopurge
                        }).then(messages => {
                            messages = messages.filter(m => m.author.id == user.id);
                            if (messages.length == 0) return funcs.send(`User has no messages to purge.`);
                            message.channel.bulkDelete(messages).catch((e) => {
                                return funcs.send(`Error: ${e.message}`);
                            });
                            message.channel.send(`__**${messages.size} message(s) from ${user.user.username} ${messages.size == 1 ? "has" : "have"} been deleted.**__`).then(m => m.delete(2000));
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            if (row.logsEnabled == "true") {
                                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                if (!finder) return;
                                let embed = new RichEmbed()
                                    .setTitle(`Messages Purged`)
                                    .setTimestamp()
                                    .setAuthor(user.user.username, user.user.avatarURL)
                                    .setColor(funcs.rc())
                                    .addField(`User purged from:`, user.user.username, true)
                                    .addField(`Purged by:`, message.author.username, true)
                                    .addField(`Purged at:`, message.createdAt.toDateString())
                                    .addField(`Number of messages:`, numtopurge)
                                    .addField(`Case number:`, `#${row.caseNumber}`)
                                    .addField(`Message:`, `[Jump To](${message.url})`);
                                let channel1 = message.guild.channels.find(c => c.name == row.logsChannel);
                                message.guild.channels.get(channel1.id).send(embed);
                            }
                        });
                    } else {
                        message.channel.fetchMessages({
                            limit: numtopurge + 1
                        }).then(messages => {
                            messages = messages.filter(m => !m.author.bot);
                            message.channel.bulkDelete(messages).catch((e) => {
                                funcs.send(`Error: ${e.message}`);
                            });
                            message.channel.send(`**__${messages.size - 1} message(s) ${(messages.size - 1) == 1 ? "has" : "have"} been deleted.__**`).then(m => m.delete(2000));
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            if (row.logsEnabled == "true") {
                                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                if (!finder) return;
                                let embed = new RichEmbed()
                                    .setTitle(`Messages Purged From Humans`)
                                    .setTimestamp()
                                    .setAuthor(message.member.user.username, message.member.user.avatarURL)
                                    .setColor(funcs.rc())
                                    .addField(`Purged by:`, message.author.username, true)
                                    .addField(`Purged at:`, message.createdAt.toDateString())
                                    .addField(`Number of messages:`, numtopurge)
                                    .addField(`Case number:`, `#${row.caseNumber}`)
                                    .addField(`Message:`, `[Jump To](${message.url})`);
                                let channel1 = message.guild.channels.find(c => c.name == row.logsChannel);
                                message.guild.channels.get(channel1.id).send(embed);
                            }
                        });
                    }
                } else if (whoto == "bots") {
                    let topurge = args.slice(1).join(` `);
                    if (!topurge) return message.channel.send(usage);
                    let numtopurge = parseInt(topurge);
                    if (isNaN(numtopurge)) {
                        funcs.send(`Not a valid number to purge.`);
                        return message.channel.send(usage);
                    }
                    if (numtopurge >= 100) return funcs.send(`Max number of messages is 100.`);
                    if (numtopurge < 2) return funcs.send(`Min number of messages is 2.`);
                    //if (message.channel.messages.size < numtopurge) return funcs.send(`That number is higher than this channel's messages. (${message.channel.messages.size})`);
                    message.channel.fetchMessages({
                        limit: numtopurge + 1
                    }).then(messages => {
                        messages = messages.filter(m => m.author.bot);
                        message.channel.bulkDelete(messages).catch((e) => {
                            funcs.send(`Error: ${e.message}`);
                        });
                        message.channel.send(`**__${messages.size - 1} message(s) ${(messages.size - 1) == 1 ? "has" : "have"} been deleted.__**`).then(m => m.delete(2000));
                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                        if (row.logsEnabled == "true") {
                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                            if (!finder) return;
                            let embed = new RichEmbed()
                                .setTitle(`Messages Purged From Bots`)
                                .setTimestamp()
                                .setAuthor(message.member.user.username, message.member.user.avatarURL)
                                .setColor(funcs.rc())
                                .addField(`Purged by:`, message.author.username, true)
                                .addField(`Purged at:`, message.createdAt.toDateString())
                                .addField(`Number of messages:`, numtopurge)
                                .addField(`Case number:`, `#${row.caseNumber}`)
                                .addField(`Message:`, `[Jump To](${message.url})`);
                            let channel1 = message.guild.channels.find(c => c.name == row.logsChannel);
                            message.guild.channels.get(channel1.id).send(embed);
                        }
                    });
                }
            });
        });
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "purge",
    aliases: [],
    usage: "Use this command to purge some messages from a channel or a user's messages in that channel.",
    commandCategory: "moderation",
    cooldownTime: '0'
};