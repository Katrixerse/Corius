module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT * FROM botBugsBlacklisted WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, (e, row) => {
        if (row.length > 0) return funcs.send(`Error reporting bug: You are blacklisted from reporting bugs.`);
        message.channel.send(`__**What would you like to do?**__\n\`\`\`Report a bug (type 1)\nReply to a bug (type 2)\nBlacklist an user from reporting bugs (type 3)\nWhitelist an user (type 4)\nType exit to cancel.\`\`\``).then(() => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                errors: ["time"],
                time: 30000
            }).then((response) => {
                response = response.array()[0].content;
                if (response == "exit") return funcs.send(`Command canceled.`);
                if (response == "1") {
                    message.channel.send(`__**Enter the bug you would like to report.**__`).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then((response) => {
                            response = response.array()[0].content;
                            const bug = response.replace(/\"+/g);
                            con.query(`INSERT INTO botBugs (userId, bugMessage, bugReplied, bugId) VALUES (?, ?, ?, ?)`, [message.author.id, bug, "false", message.createdTimestamp.toString()]);
                            funcs.send(`Bug has been successfully reported. Thank you for your help.`);
                            const { MessageEmbed } = require('discord.js');
                            const embed = new MessageEmbed()
                                .setColor(funcs.rc())
                                .setTimestamp()
                                .addField(`Bug message:`, bug)
                                .addField(`Bug ID:`, message.createdTimestamp.toString())
                                .addField(`Reported by:`, message.author.id + ` (${message.author.tag})`)
                                .setTitle(`Bug reported.`);
                            bot.channels.get("622856957816078366").send(`__**Bug ID: ${message.createdTimestamp}**__`, { embed: embed });
                        }).catch((e) => {
                            funcs.send(`You ran out of time or an error occured!`);
                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                        });
                    });
                } else if (response == "2") {
                    if (message.author.id !== "307472480627326987" && message.author.id !== "130515926117253122") return funcs.send(`You don't have the permission to use this feature.`);
                    message.channel.send(`__**Enter bug ID...**__`).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then((response) => {
                            response = response.array()[0].content;
                            const id = response;
                            con.query(`SELECT * FROM botBugs WHERE bugId ="${response}"`, async (e, rows) => {
                                if (rows.length > 1) return funcs.send(`Error! Multiple bugs with the same ID found!! How did this happen??`);
                                if (rows.length == 0) return funcs.send(`No bugs with that ID found.`);
                                const user = await bot.fetchUser(rows[0].userId);
                                if (!user) {
                                    funcs.send(`User not found. Have they deleted their discord? That's rude!`);
                                    const channel = bot.channels.find(c => c.id == "622856957816078366");
                                    channel.fetchMessages().then(messages => {
                                        const bugMess = messages.filter(m => m.embeds !== undefined).first().embeds[0].fields.filter(f => f.value == id)[0].value;
                                        bugMess.delete();
                                        return con.query(`DELETE FROM botBugs WHERE bugId ="${response}"`);
                                    });
                                    return;
                                }
                                message.channel.send(`__**What would you like to reply with to that bug?**__`).then(() => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        errors: ["time"],
                                        time: 30000
                                    }).then((response) => {
                                        response = response.array()[0].content;
                                        user.createDM().then((c) => {
                                            c.send(`**__${message.author.tag} has responded to your bug report: ${response}__**`);
                                        }).catch(() => { });
                                        const channel = bot.channels.find(c => c.id == "622856957816078366");
                                        funcs.send(`Replied to bug successfully.`);
                                        channel.fetchMessages().then(messages => {
                                            const bugMess = messages.filter(m => m.content.includes(id));
                                            bugMess.first().delete();
                                            return con.query(`DELETE FROM botBugs WHERE bugId ="${id}"`);
                                        });
                                    }).catch((e) => {
                                        funcs.send(`You ran out of time or an error occured!`);
                                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                    });
                                });
                            });
                        }).catch((e) => {
                            funcs.send(`You ran out of time or an error occured!`);
                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                        });
                    });
                } else if (response == "3") {
                    if (message.author.id !== "307472480627326987" && message.author.id !== "130515926117253122") return funcs.send(`You don't have the permission to use this feature.`);
                    message.channel.send(`__**Which ID would you like to blacklist?**__`).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then(async (response) => {
                            response = response.array()[0].content;
                            const user = await bot.fetchUser(response);
                            if (!user) return funcs.send(`No user with that ID found!`);
                            con.query(`SELECT * FROM botBugsBlacklisted WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`, (e, row) => {
                                if (row.length > 0) return funcs.send(`User is already blacklisted`);
                                con.query(`INSERT INTO botBugsBlacklisted (guildId, userId) VALUES (?, ?)`, [message.guild.id, user.id]);
                                funcs.send(`User successfully blacklisted.`);
                            });
                        }).catch((e) => {
                            funcs.send(`You ran out of time or an error occured!`);
                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                        });
                    });
                } else if (response == "4") {
                    if (message.author.id !== "307472480627326987" && message.author.id !== "130515926117253122") return funcs.send(`You don't have the permission to use this feature.`);
                    message.channel.send(`__**Which ID would you like to whitelist?**__`).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then(async (response) => {
                            response = response.array()[0].content;
                            const user = await bot.fetchUser(response);
                            if (!user) return funcs.send(`No user with that ID found!`);
                            con.query(`SELECT * FROM botBugsBlacklisted WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`, (e, row) => {
                                if (row.length == 0) return funcs.send(`User is not blacklisted.`);
                                con.query(`DELETE FROM botBugsBlacklisted WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`);
                                funcs.send(`User successfully whitelisted.`);
                            });
                        }).catch((e) => {
                            funcs.send(`You ran out of time or an error occured!`);
                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                        });
                    });
                }
            }).catch((e) => {
                funcs.send(`You ran out of time or an error occured!`);
                console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
            });
        });
    });
};

module.exports.config = {
    name: "bugs",
    aliases: [],
    usage: "Use this command to configure bugs.",
    commandCategory: "miscellaneous",
    cooldownTime: "3600"
};
