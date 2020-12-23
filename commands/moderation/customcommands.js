const {
    MessageEmbed
} = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT command_name, command_output FROM guildCustomCommands WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                const permissionNeeded = "ADMINISTRATOR";
                if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                message.channel.send(`__**What would you like to do?**__\n\`\`\`Add a custom command (say 1)\nDelete a custom command (say 2)\nView the current commands (say 3)\nType exit to cancel.\`\`\``).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        if (response == "1") {
                            if (rows.length >= 20) return funcs.send(`Too many custom commands added! (20) Please delete some and try again.`);
                            message.channel.send(`__**What would you like the command to be called? Type exit to cancel.**__`).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    if (response.array()[0].content == "exit") return funcs.send(`Command canceled!`);
                                    const commandName = response.array()[0].content;
                                    if (rows.map(r => r.command_name).includes(commandName)) return funcs.send(`Command already exists!`);
                                    if (commandName.length >= 500) return funcs.send(`Command name can't be higher than 100 characters.`);
                                    const check = / +/g;
                                    if (check.test(commandName) == true) return funcs.send(`Command name cannot have spaces!`);
                                    message.channel.send(`__**What would you like the command to output? Type exit to cancel.**__`).then(() => {
                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            errors: ["time"],
                                            time: 30000
                                        }).then((response) => {
                                            if (response.array()[0].content == "exit") return funcs.send(`Command canceled!`);
                                            const commandOutput = response.array()[0].content;
                                            if (commandOutput.length >= 1500) return funcs.send(`Output cannot be longer than 1500 characters!`);
                                            con.query(`INSERT INTO guildCustomCommands (guildId, command_name, command_output) VALUES (?, ?, ?)`, [message.guild.id, commandName, commandOutput]);
                                            funcs.send(`Command added!`);
                                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                            if (row.logsEnabled !== "true") return;
                                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                            if (!finder) return;
                                            let embed = new MessageEmbed()
                                                .setTitle(`Custom Command Added.`)
                                                .setTimestamp()
                                                .setAuthor(message.author.username, message.author.avatarURL)
                                                .setThumbnail(bot.user.avatarURL)
                                                .setColor(funcs.rc())
                                                .addField(`Command name:`, commandName)
                                                .addField(`Command output:`, commandOutput)
                                                .addField(`Added by:`, message.author.username)
                                                .addField(`Added at:`, message.createdAt.toDateString())
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
                            if (rows.length == 0) return funcs.send(`No commands to delete!`);
                            const embed = new MessageEmbed()
                                .setAuthor(message.author.tag, message.author.avatarURL)
                                .setColor(funcs.rc())
                                .setFooter(bot.user.username)
                                .setDescription(`Which custom command would you like to remove? (enter the number) (say all to delete all commands) (say exit to cancel)`)
                                .setThumbnail(message.author.avatarURL);
                            let n = 0;
                            rows.forEach(row => {
                                embed.addField(`${n += 1}#:`, `Command name: ${row.command_name}\nOutput: ${row.command_output.substr(0, 500)}`);
                            });
                            n = 0;
                            message.channel.send(embed).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    if (response.array()[0].content == "exit") return funcs.send(`Command canceled!`);
                                    if (response.array()[0].content == "all") {
                                        con.query(`DELETE FROM guildCustomCommands WHERE guildId ="${message.guild.id}"`);
                                        funcs.send(`All commands deleted! (${rows.length})`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new MessageEmbed()
                                            .setTitle(`:warning: All Custom Commands Deleted. :warning:`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Commands deleted:`, rows.length)
                                            .addField(`Deleted by:`, message.author.username)
                                            .addField(`Deleted at:`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                        return;
                                    }
                                    const picked = parseInt(response.array()[0].content);
                                    if (isNaN(picked) || picked > rows.length || picked <= 0) return funcs.send(`Not a valid number!`);
                                    embed.fields.forEach(field => {
                                        if (field.name.startsWith(picked)) {
                                            const commandName = field.value.split("\n")[0].split(/ +/g)[2];
                                            con.query(`DELETE FROM guildCustomCommands WHERE guildId ="${message.guild.id}" AND command_name ="${commandName}"`);
                                            funcs.send(`Command deleted!`);
                                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                            if (row.logsEnabled !== "true") return;
                                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                            if (!finder) return;
                                            let embed = new MessageEmbed()
                                                .setTitle(`Custom Command Deleted.`)
                                                .setTimestamp()
                                                .setAuthor(message.author.username, message.author.avatarURL)
                                                .setThumbnail(bot.user.avatarURL)
                                                .setColor(funcs.rc())
                                                .addField(`Command deleted:`, commandName)
                                                .addField(`Deleted by:`, message.author.username)
                                                .addField(`Deleted at:`, message.createdAt.toDateString())
                                                .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                .addField(`Message:`, `[JumpTo](${message.url})`);
                                            message.guild.channels.get(finder.id).send(embed);
                                        }
                                    });
                                }).catch((e) => {
                                    funcs.send(`You ran out of time or an error occured!`);
                                    console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                });
                            });
                        } else if (response == "3") {
                            if (rows.length == 0) return funcs.send(`No commands to view!`);
                            const embed = new MessageEmbed()
                                .setAuthor(message.author.tag, message.author.avatarURL)
                                .setColor(funcs.rc())
                                .setFooter(bot.user.username)
                                .setThumbnail(message.author.avatarURL);
                            let n = 0;
                            rows.forEach(row => {
                                embed.addField(`${n += 1}#:`, `Command name: ${row.command_name}\nOutput: ${row.command_output.substr(0, 500)}`);
                            });
                            n = 0;
                            message.channel.send(embed);
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
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "customcommands",
    aliases: ["cc"],
    usage: "Use this command to manage custom commands.",
    commandCategory: "moderation",
    cooldownTime: '5'
};