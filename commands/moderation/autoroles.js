const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.autoroleEnabled, ga.roles, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildAutoRole AS ga ON cn.guildId = ga.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                con.query(`SELECT * FROM guildAutoRole WHERE guildId ="${message.guild.id}"`, (e, roles) => {
                    row = row[0];
                    let row1 = rows.map(r => r.guildMods);
                    const permissionNeeded = "MANAGE_GUILD";
                    if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                    message.channel.send(`__**What would you like to do?**__\n\`\`\`Enable autoroles (type 1)\nDisable autoroles (type 2)\nView the current role(s) (type 3)\nAdd to the current role(s) (type 4)\nDelete an autorole (type 5)\nType exit to cancel\`\`\``).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then((response) => {
                            response = response.array()[0].content;
                            if (response == "1") {
                                if (row.autoRoleEnabled == "true") return funcs.send(`Autoroles are already enabled!`);
                                con.query(`UPDATE guildSettings SET autoRoleEnabled ="true" WHERE guildId = ${message.guild.id}`);
                                funcs.send(`Autoroles have been enabled!`);
                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                if (row.logsEnabled !== "true") return;
                                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                if (!finder) return;
                                let embed = new MessageEmbed()
                                    .setTitle(`Autoroles Enabled.`)
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
                                if (row.autoRoleEnabled == "false") return funcs.send(`Autoroles are not enabled!`);
                                con.query(`UPDATE guildSettings SET autoRoleEnabled ="false" WHERE guildId = ${message.guild.id}`);
                                funcs.send(`Autoroles have been disabled!`);
                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                if (row.logsEnabled !== "true") return;
                                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                if (!finder) return;
                                let embed = new MessageEmbed()
                                    .setTitle(`Autoroles Disabled.`)
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
                                if (roles.length == 1) return funcs.send(`No roles have been added yet!`);
                                const embed = new MessageEmbed()
                                    .setAuthor(message.author.tag, message.author.avatarURL)
                                    .setColor(funcs.rc())
                                    .setFooter(bot.user.username)
                                    .setThumbnail(message.author.avatarURL);
                                const roles1 = roles.map(r => r.roles);
                                let n = 0;
                                roles.forEach(role => {
                                    if (role.roles == "none") return;
                                    embed.addField(`${n += 1}#:`, role.roles);
                                });
                                message.channel.send(embed);
                            } else if (response == "4") {
                                if (roles.length >= 25) return funcs.send(`25 or more roles already added. Please delete some and try again!`);
                                message.channel.send(`__**Which role would you like to add?**__`).then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        errors: ["time"],
                                        time: 30000
                                    }).then((response) => {
                                        const role = response.array()[0].content;
                                        const check = message.guild.roles.find(r => r.name == role);
                                        if (!check) return funcs.send(`Not a valid role!`, true);
                                        if (check.position >= message.guild.me.highestRole.position) return funcs.send(`That role has a higher or the same position as me!`);
                                        if (check.position >= message.member.highestRole.position) return funcs.send(`That role has a higher or the same position as you!`);
                                        const roles1 = roles.map(r => r.roles).filter(r => r == check.name);
                                        if (roles1.length > 0) return funcs.send(`Role is already set as an autorole!`);
                                        con.query(`INSERT INTO guildAutoRole (guildId, roles) VALUES (?, ?)`, [message.guild.id, check.name]);
                                        funcs.send(`Role added!`, false);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new MessageEmbed()
                                            .setTitle(`Role Added To Autoroles.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Added by:`, message.author.username)
                                            .addField(`Added at:`, message.createdAt.toDateString())
                                            .addField(`Role:`, check.name)
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    }).catch((e) => {
                                        funcs.send(`You ran out of time or an error occured!`);
                                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                    });
                                });
                            } else if (response == "5") {
                                if (roles.length == 1) return funcs.send(`There are no autoroles to remove!`);
                                const embed = new MessageEmbed()
                                    .setAuthor(message.author.tag, message.author.avatarURL)
                                    .setColor(funcs.rc())
                                    .setFooter(bot.user.username)
                                    .setTitle(`Which autorole would you like to delete?`)
                                    .setDescription(`**__(Enter the number)__**`)
                                    .setThumbnail(message.author.avatarURL);
                                let n = 0;
                                roles.forEach(role => {
                                    if (role.roles == "none") return;
                                    embed.addField(`${n += 1}#:`, role.roles);
                                });
                                message.channel.send(embed).then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        errors: ["time"],
                                        time: 30000
                                    }).then((response) => {
                                        const numberPicked = parseInt(response.array()[0].content);
                                        if (isNaN(numberPicked) || numberPicked <= 0 || numberPicked > roles.length - 1) return funcs.send(`Not a valid number!`);
                                        embed.fields.forEach(field => {
                                            if (field.name.startsWith(numberPicked)) {
                                                const rolePicked = field.value;
                                                con.query(`DELETE FROM guildAutoRole WHERE guildId ="${message.guild.id}" AND roles ="${rolePicked}"`);
                                                funcs.send(`Role successfully deleted!`, false);
                                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                if (row.logsEnabled !== "true") return;
                                                let finder1 = message.guild.channels.find(c => c.name == row.logsChannel);
                                                if (!finder1) return;
                                                let embed = new MessageEmbed()
                                                    .setTitle(`Role Removed From Autoroles.`)
                                                    .setTimestamp()
                                                    .setAuthor(message.author.username, message.author.avatarURL)
                                                    .setThumbnail(bot.user.avatarURL)
                                                    .setColor(funcs.rc())
                                                    .addField(`Removed by:`, message.author.username)
                                                    .addField(`Removed at:`, message.createdAt.toDateString())
                                                    .addField(`Role:`, finder.name)
                                                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                    .addField(`Message:`, `[JumpTo](${message.url})`);
                                                message.guild.channels.get(finder1.id).send(embed);
                                            }
                                        });
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
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "autoroles",
    aliases: ["ar"],
    usage: "Use this command to manage autoroles.",
    commandCategory: "moderation",
    cooldownTime: '0'
};