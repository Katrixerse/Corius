module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            const permissionNeeded = "ADMINISTRATOR";
            if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
            message.channel.send(`__**Who would you like to apply a punishment to?**__\n\`\`\`Users with a certain amount of warns (type 1)\nUsers with a certain amount of mutes (type 2)\nUsers with a certain amount of kicks (type 3)\nUsers with a certain amount of bans (type 4)\nUsers with a certain amount of reports (type 5)\nType exit to cancel.\`\`\`\n`).then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    errors: ["time"],
                    time: 30000
                }).then((response) => {
                    response = response.array()[0].content;
                    if (response == "1") {
                        message.channel.send(`__**How many warns should the users have to be punished? Type exit to cancel.**__`).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                response = response.array()[0].content;
                                if (response == 'exit') return funcs.send(`Command canceled!`);
                                const num = parseInt(response);
                                if (isNaN(num) || num <= 0) return funcs.send(`Not a valid number!`);
                                if (num > 20) return funcs.send(`Number cannot be higher than 20!`);
                                message.channel.send(`__**What would you like to do to users with a warn count higher than ${num}?**__\n\`\`\`Ban (type 1)\nKick (type 2)\nType exit to cancel\`\`\``).then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        errors: ["time"],
                                        time: 30000
                                    }).then((response) => {
                                        response = response.array()[0].content;
                                        if (response == 'exit') return funcs.send(`Command canceled!`);
                                        if (response == "1") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND warnings >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a warn count higher than ${num} found!`);
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    await message.guild.ban(member).catch(e => funcs.send(`Error banning ${member.user.username}: ${e.message}`));
                                                });
                                                funcs.send(`Banned all users with a warn count higher than ${num} that have a lower position than me and you.\n(${rows.map(r => message.guild.members.find(m => m.id == r.userId).position < message.guild.me.highestRole.position && message.guild.members.find(m => m.id == r.userId).position < message.member.highestRole.position).join(', ')})`);
                                            });
                                        } else if (response == "2") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND warnings >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a warn count higher than ${num} found!`);
                                                let members = [];
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    members.push(member.user.tag);
                                                    await member.kick().catch(e => funcs.send(`Error kicking ${member.user.username}: ${e.message}`));
                                                });
                                                if (members.length == 0) members.push('No members with a lower position than me and you found.');
                                                funcs.send(`Kicked all users with a warn count higher than ${num} that have a lower position than me and you.\n(${members.join(', ')})`);
                                            });
                                        }
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
                        message.channel.send(`__**How many mutes should the users have to be punished? Type exit to cancel.**__`).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                response = response.array()[0].content;
                                if (response == 'exit') return funcs.send(`Command canceled!`);
                                const num = parseInt(response);
                                if (isNaN(num) || num <= 0) return funcs.send(`Not a valid number!`);
                                if (num > 20) return funcs.send(`Number cannot be higher than 20!`);
                                message.channel.send(`__**What would you like to do to users with a mute count higher than ${num}?**__\n\`\`\`Ban (type 1)\nKick (type 2)\nType exit to cancel\`\`\``).then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        errors: ["time"],
                                        time: 30000
                                    }).then((response) => {
                                        response = response.array()[0].content;
                                        if (response == 'exit') return funcs.send(`Command canceled!`);
                                        if (response == "1") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND mutes >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a mute count higher than ${num} found!`);
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    await message.guild.ban(member).catch(e => funcs.send(`Error banning ${member.user.username}: ${e.message}`));
                                                });
                                                funcs.send(`Banned all users with a mute count higher than ${num} that have a lower position than me and you.\n(${rows.map(r => message.guild.members.find(m => m.id == r.userId).position < message.guild.me.highestRole.position && message.guild.members.find(m => m.id == r.userId).position < message.member.highestRole.position).join(', ')})`);
                                            });
                                        } else if (response == "2") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND mutes >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a mute count higher than ${num} found!`);
                                                let members = [];
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    members.push(member.user.tag);
                                                    await member.kick().catch(e => funcs.send(`Error kicking ${member.user.username}: ${e.message}`));
                                                });
                                                if (members.length == 0) members.push('No members with a lower position than me and you found.');
                                                funcs.send(`Kicked all users with a mute count higher than ${num} that have a lower position than me and you.\n(${members.join(', ')})`);
                                            });
                                        }
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
                    } else if (response == "3") {
                        message.channel.send(`__**How many kicks should the users have to be punished? Type exit to cancel.**__`).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                response = response.array()[0].content;
                                if (response == 'exit') return funcs.send(`Command canceled!`);
                                const num = parseInt(response);
                                if (isNaN(num) || num <= 0) return funcs.send(`Not a valid number!`);
                                message.channel.send(`__**What would you like to do to users with a kick count higher than ${num}?**__\n\`\`\`Ban (type 1)\nKick (type 2)\nType exit to cancel\`\`\``).then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        errors: ["time"],
                                        time: 30000
                                    }).then((response) => {
                                        response = response.array()[0].content;
                                        if (response == 'exit') return funcs.send(`Command canceled!`);
                                        if (response == "1") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND kicks >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a kick count higher than ${num} found!`);
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    await message.guild.ban(member).catch(e => funcs.send(`Error banning ${member.user.username}: ${e.message}`));
                                                });
                                                funcs.send(`Banned all users with a kick count higher than ${num} that have a lower position than me and you.\n(${rows.map(r => message.guild.members.find(m => m.id == r.userId).position < message.guild.me.highestRole.position && message.guild.members.find(m => m.id == r.userId).position < message.member.highestRole.position).join(', ')})`);
                                            });
                                        } else if (response == "2") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND kicks >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a kick count higher than ${num} found!`);
                                                let members = [];
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    members.push(member.user.tag);
                                                    await member.kick().catch(e => funcs.send(`Error kicking ${member.user.username}: ${e.message}`));
                                                });
                                                if (members.length == 0) members.push('No members with a lower position than me and you found.');
                                                funcs.send(`Kicked all users with a kick count higher than ${num} that have a lower position than me and you.\n(${members.join(', ')})`);
                                            });
                                        }
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
                    } else if (response == "4") {
                        message.channel.send(`__**How many bans should the users have to be punished? Type exit to cancel.**__`).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                response = response.array()[0].content;
                                if (response == 'exit') return funcs.send(`Command canceled!`);
                                const num = parseInt(response);
                                if (isNaN(num) || num <= 0) return funcs.send(`Not a valid number!`);
                                message.channel.send(`__**What would you like to do to users with a ban count higher than ${num}?**__\n\`\`\`Ban (type 1)\nKick (type 2)\nType exit to cancel\`\`\``).then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        errors: ["time"],
                                        time: 30000
                                    }).then((response) => {
                                        response = response.array()[0].content;
                                        if (response == 'exit') return funcs.send(`Command canceled!`);
                                        if (response == "1") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND bans >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a ban count higher than ${num} found!`);
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    await message.guild.ban(member).catch(e => funcs.send(`Error banning ${member.user.username}: ${e.message}`));
                                                });
                                                funcs.send(`Banned all users with a ban count higher than ${num} that have a lower position than me and you.\n(${rows.map(r => message.guild.members.find(m => m.id == r.userId).position < message.guild.me.highestRole.position && message.guild.members.find(m => m.id == r.userId).position < message.member.highestRole.position).join(', ')})`);
                                            });
                                        } else if (response == "2") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND bans >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a ban count higher than ${num} found!`);
                                                let members = [];
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    members.push(member.user.tag);
                                                    await member.kick().catch(e => funcs.send(`Error kicking ${member.user.username}: ${e.message}`));
                                                });
                                                if (members.length == 0) members.push('No members with a lower position than me and you found.');
                                                funcs.send(`Kicked all users with a ban count higher than ${num} that have a lower position than me and you.\n(${members.join(', ')})`);
                                            });
                                        }
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
                    } else if (response == "5") {
                        message.channel.send(`__**How many reports should the users have to be punished? Type exit to cancel.**__`).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                response = response.array()[0].content;
                                if (response == 'exit') return funcs.send(`Command canceled!`);
                                const num = parseInt(response);
                                if (isNaN(num) || num <= 0) return funcs.send(`Not a valid number!`);
                                message.channel.send(`__**What would you like to do to users with a report count higher than ${num}?**__\n\`\`\`Ban (type 1)\nKick (type 2)\nType exit to cancel\`\`\``).then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        errors: ["time"],
                                        time: 30000
                                    }).then((response) => {
                                        response = response.array()[0].content;
                                        if (response == 'exit') return funcs.send(`Command canceled!`);
                                        if (response == "1") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND reports >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a report count higher than ${num} found!`);
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    await message.guild.ban(member).catch(e => funcs.send(`Error banning ${member.user.username}: ${e.message}`));
                                                });
                                                funcs.send(`Banned all users with a report count higher than ${num} that have a lower position than me and you.\n(${rows.map(r => message.guild.members.find(m => m.id == r.userId).position < message.guild.me.highestRole.position && message.guild.members.find(m => m.id == r.userId).position < message.member.highestRole.position).join(', ')})`);
                                            });
                                        } else if (response == "2") {
                                            con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND reports >= ${num}`, (e, rows) => {
                                                if (rows.length == 0) return funcs.send(`No users with a report count higher than ${num} found!`);
                                                let members = [];
                                                rows.forEach(async user => {
                                                    const member = message.guild.members.find(m => m.id == user.userId);
                                                    if (!member) return;
                                                    if (member.highestRole.position >= message.member.highestRole.position) return;
                                                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                                                    members.push(member.user.tag);
                                                    await member.kick().catch(e => funcs.send(`Error kicking ${member.user.username}: ${e.message}`));
                                                });
                                                if (members.length == 0) members.push('No members with a lower position than me and you found.');
                                                funcs.send(`Kicked all users with a report count higher than ${num} that have a lower position than me and you.\n(${members.join(', ')})`);
                                            });
                                        }
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
            //     con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
            //     if (row.logsEnabled !== "true") return;
            //     let finder = message.guild.channels.find(c => c.name == row.logsChannel);
            //     if (!finder) return;
            //     let embed = new RichEmbed()
            //         .setTitle(`Prefix Changed.`)
            //         .setTimestamp()
            //         .setAuthor(message.author.username, message.author.avatarURL)
            //         .setThumbnail(bot.user.avatarURL)
            //         .setColor(funcs.rc())
            //         .addField(`Prefix:`, prefix)
            //         .addField(`Changed by:`, message.author.username)
            //         .addField(`Changed at`, message.createdAt.toDateString())
            //         .addField(`Case number:`, `#${row.caseNumber + 1}`)
            //         .addField(`Message:`, `[JumpTo](${message.url})`);
            //     message.guild.channels.get(finder.id).send(embed);
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "applypunishment",
    aliases: [],
    usage: "Use this command to apply a punishments to certain users.",
    commandCategory: "moderation",
    cooldownTime: '3'
};