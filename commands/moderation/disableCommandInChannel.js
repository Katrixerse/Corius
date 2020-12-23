const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
            row = row[0];
            con.query(`SELECT * FROM disabledCommandsInChannels WHERE guildId ="${message.guild.id}"`, (e, commands) => {
                const permissionNeeded = "ADMINISTRATOR";
                if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                message.channel.send(`__**What would you like to do?**__\n\`\`\`Enable a command in a channel (type 1)\nDisable a command in a channel (type 2)\nType exit to cancel\`\`\``).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        if (response == "1") {
                            const embed = new MessageEmbed()
                                .setAuthor(message.author.tag, message.author.avatarURL)
                                .setColor(funcs.rc())
                                .setTitle(`Which command would you like to enable?`)
                                .setDescription(`Type the number bound to the command. Type exit to cancel.`)
                                .setFooter(bot.user.username)
                                .setThumbnail(message.author.avatarURL);
                            let n = 0;
                            commands.forEach(c => {
                                if (embed.fields.map(f => f.value == c.command).length > 0) return;
                                embed.addField(`${n += 1}#:`, c.command);
                            });
                            n = 0;
                            message.channel.send(embed).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    let command = response.array()[0].content;
                                    if (command == "exit") return funcs.send(`Command canceled!`);
                                    const numberPicked = parseInt(command);
                                    if (isNaN(numberPicked)) return funcs.send(`Not a valid number!`);
                                    if (numberPicked <= 0 || numberPicked > commands.length) return funcs.send(`Not a valid number!`);
                                    embed.fields.forEach(field => {
                                        if (field.name.startsWith(numberPicked)) {
                                            command = field.value;
                                        }
                                    });
                                    const embed1 = new MessageEmbed()
                                        .setAuthor(message.author.tag, message.author.avatarURL)
                                        .setColor(funcs.rc())
                                        .setTitle(`In which channel would you like to enable that command?`)
                                        .setDescription(`Type the number bound to the channel. Type exit to cancel.`)
                                        .setFooter(bot.user.username)
                                        .setThumbnail(message.author.avatarURL);
                                    const channels = commands.filter(c => c.command == command);
                                    channels.forEach(channel => {
                                        embed1.addField(`${n += 1}#:`, channel.channel);
                                    });
                                    message.channel.send(embed1).then(() => {
                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            errors: ["time"],
                                            time: 30000
                                        }).then((response) => {
                                            if (response.array()[0].content == 'exit') return funcs.send(`Command canceled!`);
                                            const numberPicked = parseInt(response.array()[0].content);
                                            if (isNaN(numberPicked)) return funcs.send(`Not a valid number!`);
                                            if (numberPicked <= 0 || numberPicked > channels.length) return funcs.send(`Not a valid number!`);
                                            let channel;
                                            embed1.fields.forEach(field => {
                                                if (field.name.startsWith(numberPicked)) {
                                                    channel = field.value;
                                                }
                                            });
                                            con.query(`DELETE FROM disabledCommandsInChannels WHERE guildId ="${message.guild.id}" AND command ="${command}" AND channel ="${channel}"`);
                                            funcs.send(`Command has been enabled in that channel!`);
                                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                            if (row.logsEnabled !== "true") return;
                                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                            if (!finder) return;
                                            let embed = new MessageEmbed()
                                                .setTitle(`Command Enabled in **__${channel}__**.`)
                                                .setTimestamp()
                                                .setAuthor(message.author.username, message.author.avatarURL)
                                                .setThumbnail(bot.user.avatarURL)
                                                .setColor(funcs.rc())
                                                .addField(`Command:`, command)
                                                .addField(`Enabled by:`, message.author.username)
                                                .addField(`Enabled at`, message.createdAt.toDateString())
                                                .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                .addField(`Message:`, `[JumpTo](${message.url})`);
                                            message.guild.channels.get(finder.id).send(embed);
                                        }).catch((e) => {
                                            funcs.send(`You ran out of time or an error occured!`);
                                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                        });
                                    });
                                }).catch((e) => {
                                    funcs.send(`You ran out of time or an error occured!`);
                                    console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                });
                            });
                        } else if (response == "2") {
                            message.channel.send(`__**Which command would you like to disable? Type exit to cancel.**__`).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    const command = response.array()[0].content;
                                    if (command == "exit") return funcs.send(`Command canceled!`);
                                    if (!bot.commands.get(command)) return funcs.send(`Command not found!`);
                                    if (command == "disableCommandInChannel" || command == "disableCommand") return funcs.send(`Not a valid command!`);
                                    message.channel.send(`__**In which channel would you like to disable that command? Type exit to cancel**__`).then(() => {
                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            errors: ["time"],
                                            time: 30000
                                        }).then((response) => {
                                            if (response.array()[0].content == 'exit') return funcs.send(`Command canceled!`);
                                            const channel = message.guild.channels.find(c => c.name == response.array()[0].content);
                                            if (!channel) return funcs.send(`Channel not found!`);
                                            const check = commands.filter(c => c.command == command && c.channel == channel.name && c.guildId == message.guild.id);
                                            if (check.length > 0) return funcs.send(`Command is already disabled in that channel!`);
                                            con.query(`INSERT INTO disabledCommandsInChannels (guildId, channel, command) VALUES (?, ?, ?)`, [message.guild.id, channel.name, command.toLowerCase()]);
                                            funcs.send(`Command has been disabled in that channel!`);
                                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                            if (row.logsEnabled !== "true") return;
                                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                            if (!finder) return;
                                            let embed = new MessageEmbed()
                                                .setTitle(`Command Disabled in **__${channel.name}__**.`)
                                                .setTimestamp()
                                                .setAuthor(message.author.username, message.author.avatarURL)
                                                .setThumbnail(bot.user.avatarURL)
                                                .setColor(funcs.rc())
                                                .addField(`Command:`, command)
                                                .addField(`Disabled by:`, message.author.username)
                                                .addField(`Disabled at`, message.createdAt.toDateString())
                                                .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                .addField(`Message:`, `[JumpTo](${message.url})`);
                                            message.guild.channels.get(finder.id).send(embed);
                                        }).catch((e) => {
                                            funcs.send(`You ran out of time or an error occured!`);
                                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                        });
                                    });
                                }).catch((e) => {
                                    funcs.send(`You ran out of time or an error occured!`);
                                    console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                });
                            });
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
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "manageCommandInChannel",
    aliases: ["mcic"],
    usage: "Use this command to manage a command in a channel.",
    commandCategory: "moderation",
    cooldownTime: '0'
};