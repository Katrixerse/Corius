const {
    richEmbed
} = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
            row = row[0];
            con.query(`SELECT response_name, response_output FROM guildCustomResponses WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                const permissionNeeded = "ADMINISTRATOR";
                if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                message.channel.send(`__**What would you like to do?**__\n\`\`\`Add a custom response (say 1)\nDelete a custom response (say 2)\nView the current responses (say 3)\nType exit to cancel.\`\`\``).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        if (response == "1") {
                            if (rows.length >= 20) return funcs.send(`Too many custom responses added! (20) Please delete some and try again.`);
                            message.channel.send(`__**What would you like the response to be called? Type exit to cancel.**__`).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    if (response.array()[0].content == "exit") return funcs.send(`Command canceled!`);
                                    const commandName = response.array()[0].content;
                                    if (rows.map(r => r.command_name).includes(commandName)) return funcs.send(`Custom response already exists!`);
                                    if (commandName.length >= 500) return funcs.send(`Response name can't be higher than 100 characters.`);
                                    message.channel.send(`__**What would you like the response to output? Type exit to cancel.**__`).then(() => {
                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            errors: ["time"],
                                            time: 30000
                                        }).then((response) => {
                                            if (response.array()[0].content == "exit") return funcs.send(`Command canceled!`);
                                            const commandOutput = response.array()[0].content;
                                            if (commandOutput.length >= 1500) return funcs.send(`Output cannot be longer than 1500 characters!`);
                                            con.query(`INSERT INTO guildCustomResponses (guildId, response_name, response_output) VALUES (?, ?, ?)`, [message.guild.id, con.escape(commandName), con.escape(commandOutput)]);
                                            funcs.send(`Response added!`);
                                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                            if (row.logsEnabled !== "true") return;
                                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                            if (!finder) return;
                                            let embed = new richEmbed()
                                                .setTitle(`Custom Response Added.`)
                                                .setTimestamp()
                                                .setAuthor(message.author.username, message.author.avatarURL)
                                                .setThumbnail(bot.user.avatarURL)
                                                .setColor(funcs.rc())
                                                .addField(`Response name:`, commandName)
                                                .addField(`Response output:`, commandOutput)
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
                            if (rows.length == 0) return funcs.send(`No response to delete!`);
                            const embed = new richEmbed()
                                .setAuthor(message.author.tag, message.author.avatarURL)
                                .setColor(funcs.rc())
                                .setFooter(bot.user.username)
                                .setDescription(`Which custom response would you like to remove? (enter the number) (say all to delete all responses) (say exit to cancel)`)
                                .setThumbnail(message.author.avatarURL);
                            let n = 0;
                            rows.forEach(row => {
                                embed.addField(`${n += 1}#:`, `Response name: ${row.response_name}\nOutput: ${row.response_output.substr(0, 500)}`);
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
                                        con.query(`DELETE FROM guildCustomResponses WHERE guildId ="${message.guild.id}"`);
                                        funcs.send(`All responses deleted! (${rows.length})`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new richEmbed()
                                            .setTitle(`:warning: All Custom Responses Deleted. :warning:`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Responses deleted:`, rows.length)
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
                                            con.query(`DELETE FROM guildCustomResponses WHERE guildId ="${message.guild.id}" AND response_name =${con.escape(commandName)}`);
                                            funcs.send(`Response deleted!`);
                                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                            if (row.logsEnabled !== "true") return;
                                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                            if (!finder) return;
                                            let embed = new richEmbed()
                                                .setTitle(`Custom Response Deleted.`)
                                                .setTimestamp()
                                                .setAuthor(message.author.username, message.author.avatarURL)
                                                .setThumbnail(bot.user.avatarURL)
                                                .setColor(funcs.rc())
                                                .addField(`Response deleted:`, commandName)
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
                            if (rows.length == 0) return funcs.send(`No responses to view!`);
                            const embed = new richEmbed()
                                .setAuthor(message.author.tag, message.author.avatarURL)
                                .setColor(funcs.rc())
                                .setFooter(bot.user.username)
                                .setThumbnail(message.author.avatarURL);
                            let n = 0;
                            rows.forEach(row => {
                                embed.addField(`${n += 1}#:`, `Response name: ${row.response_name}\nOutput: ${row.response_output.substr(0, 500)}`);
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
    name: "customresponses",
    aliases: ["cs"],
    usage: "Use this command to manage custom responses.",
    commandCategory: "moderation",
    cooldownTime: '5'
};