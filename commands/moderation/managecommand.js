const { richEmbed } = require('discord.js');
module.exports.run = (bot, message, args, funcs, con) => {
    try {
        const permissionNeeded = "ADMINISTRATOR";
        if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You don't have the ${permissionNeeded} permission to use this command.`, true);
        message.channel.send(`**__What would you like to do?__** \n\`\`\`[1] Disable a command (type 1)\n[2] Enable a command (type 2)\n[3] Exit (type 3)\`\`\``).then(() => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                errors: ["time"],
                time: 30000
            }).then(response => {
                response = response.array()[0];
                if (response.content == "1") {
                    message.channel.send(`__**Which command would you like to disable?**__`).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then((response) => {
                            const commandToDisable = response.array()[0].content;
                            if (commandToDisable == undefined) return funcs.send(`You need to specify a command to disable!`, true);
                            if (commandToDisable == "disableCommand") return funcs.send(`You cannot disable that command!`, true);
                            const check = bot.commands.get(commandToDisable);
                            if (!check) return funcs.send(`That command does not exist!`, true);
                            con.query(`SELECT gds.commands, gl.logsChannel, gl.logsEnabled, cs.caseNumber FROM guildDisabledSettings AS gds LEFT JOIN guildSettings AS gl ON gds.guildId = gl.guildId, guildCasenumber AS cs ON gds.guildId = cs.guildId WHERE gds.guildId ="${message.guild.id}"`, (e, row) => {
                                if (row.length == 0) {
                                    funcs.send(`An error occurred! (Cannot find row)`);
                                    return console.log(`ERROR: Cannot find a row in table guildDisabledSettings!`);
                                }
                                row = row[0];
                                const isAlreadyDisabled = row.commands.toLowerCase().includes(commandToDisable.toLowerCase());
                                if (isAlreadyDisabled) return funcs.send(`That command is already disabled!`, true);
                                con.query(`UPDATE guildDisabledSettings SET commands ="${row.commands + commandToDisable}" WHERE guildId = ${message.guild.id}`);
                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                funcs.send(`Command has been disabled!`, false);
                                if (row.logsEnabled === "false") return;
                                const finder = message.guild.channels.find(c => c.name === row.logsChannel);
                                if (!finder) return;
                                const embed = new richEmbed()
                                    .setAuthor(message.author.tag, message.author.avatarURL)
                                    .setColor(funcs.rc())
                                    .setTitle(`Command Disabled`)
                                    .addField(`Command:`, commandToDisable)
                                    .addField(`Disabled by:`, message.author.username)
                                    .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                                    .addField(`Disabled at:`, new Date().toDateString())
                                    .addField(`Message:`, `[JumpTo](${message.url})`)
                                    .setFooter(bot.user.username)
                                    .setThumbnail(message.author.avatarURL);
                                message.guild.channels.get(finder.id).send(embed);
                            });
                        }).catch((e) => {
                            funcs.send(`You ran out of time or an error occured!`);
                            console.log(`Error: ${e.message} in guild ${message.guild.name} command managecommand`);
                        });
                    });
                } else if (response.content == "2") {
                    message.channel.send(`__**Which command would you like to enable?**__`).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then((response) => {
                            const commandToEnable = response.array()[0].content;
                            if (commandToEnable == undefined) return funcs.send(`You need to specify a command to enable!`, true);
                            con.query(`SELECT gds.commands, gl.logsChannel, gl.logsEnabled, cs.caseNumber FROM guildDisabledSettings AS gds LEFT JOIN guildSettings AS gl ON gds.guildId = gl.guildId, guildCasenumber AS cs ON gds.guildId = cs.guildId WHERE gds.guildId ="${message.guild.id}"`, (e, row) => {
                                row = row[0];
                                const check = row.commands.toLowerCase().includes(commandToEnable.toLowerCase());
                                if (!check) return funcs.send(`That command is not disabled!`, true);
                                if (!row) {
                                    funcs.send(`An error occurred! (Cannot find row)`);
                                    console.log(`ERROR: Cannot find a row in table guildDisabledSettings!`);
                                }
                                con.query(`UPDATE guildDisabledSettings SET commands ="${row.commands.toLowerCase().split(commandToEnable.toLowerCase())}" WHERE guildId = ${message.guild.id}`);
                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                funcs.send(`Command has been enabled!`, false);
                                if (row.logsEnabled === "false") return;
                                const finder = message.guild.channels.find(c => c.name === row.logsChannel);
                                if (!finder) return;
                                const embed = new richEmbed()
                                    .setAuthor(message.author.tag, message.author.avatarURL)
                                    .setColor(funcs.rc())
                                    .setTitle(`Command Enabled`)
                                    .addField(`Command:`, commandToEnable)
                                    .addField(`Enabled by:`, message.author.username)
                                    .addField(`Enabled at:`, new Date().toDateString())
                                    .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                                    .addField(`Message:`, `[JumpTo](${message.url})`)
                                    .setFooter(bot.user.username)
                                    .setThumbnail(message.author.avatarURL);
                                message.guild.channels.get(finder.id).send(embed);
                            }).catch((e) => {
                                funcs.send(`You ran out of time or an error occured!`);
                                console.log(`Error: ${e.message} in guild ${message.guild.name} command manageCommand`);
                            });
                        });
                    });
                } else if (response.content == "3") {
                    return funcs.send("Command canceled.");
                }
            }).catch((e) => {
                funcs.send(`You ran out of time or an error occured!`);
                console.log(`Error: ${e.message} in guild ${message.guild.name}, command managecommand.`);
            });
        });
    } catch (e) {
        console.error(e);
        funcs.send(`Oh no! An error occurred! ${e.message}`);
    }
};

module.exports.config = {
    name: "managecommand",
    aliases: ["mc"],
    usage: "Manage a command.",
    commandCategory: "moderation",
    cooldownTime: '0'
};