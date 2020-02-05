const { RichEmbed } = require('discord.js');
const ms = require('ms');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                message.channel.send(`__**How many winners would you like your giveaway to have? Type exit to cancel**__`).then((mess1) => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then(async (response) => {
                        response = response.array()[0].content;
                        if (response == 'exit') return funcs.send(`Command canceled!`);
                        const winners = parseInt(response);
                        if (isNaN(winners)) return funcs.send(`Not a valid number!`);
                        if (winners > 50) return funcs.send(`The maximum winner count is 50!`);
                        message.channel.send(`__**What prize would you like your giveaway to have? Type exit to cancel.**__`).then((mess2) => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then(async (response) => {
                                response = response.array()[0].content;
                                if (response == 'exit') return funcs.send(`Command canceled!`);
                                const prize = response;
                                message.channel.send(`__**How much would you like your giveaway to run for? Type exit to cancel. (use s, m, h or d)**__`).then((mess3) => {
                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        errors: ["time"],
                                        time: 30000
                                    }).then(async (response) => {
                                        response = response.array()[0].content;
                                        if (response == 'exit') return funcs.send(`Command canceled!`);
                                        const time = response;
                                        if (!time.endsWith('s') && !time.endsWith('m') && !time.endsWith('h') && !time.endsWith('d')) return funcs.send(`Time doesn't end in s (seconds), m (minutes), h (hours) nor d (days)`);
                                        const timeMs = parseInt(ms(time));
                                        //if (parseInt(ms('28d')) > timeMs) return funcs.send(`Time cannot be higher than 28 days!`);
                                        if (isNaN(timeMs)) return funcs.send(`Not a valid time!`);
                                        if (timeMs < 0) return funcs.send(`Not a valid time!`);
                                        const giveawayTime = timeMs;
                                        message.channel.send(`__**What would you like to name your giveaway? Type exit to cancel.**__`).then((mess4) => {
                                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                max: 1,
                                                errors: ["time"],
                                                time: 30000
                                            }).then(async (response) => {
                                                response = response.array()[0].content;
                                                if (response == 'exit') return funcs.send(`Command canceled!`);
                                                const giveawayName = response;
                                                if (giveawayName.length > 400) return funcs.send(`Giveaway name cannot be higher than 400 characters!`);
                                                mess1.delete();
                                                mess2.delete();
                                                mess3.delete();
                                                mess4.delete();
                                                con.query(`INSERT INTO guildGiveaways (guildId, giveawayName, giveawayTime, giveawayRunning, timeId, winnerCount) VALUES (?, ?, ?, ?, ?, ?)`, [message.guild.id, giveawayName, giveawayTime, 1, message.createdTimestamp.toString(), winners]);
                                                const embed = new RichEmbed()
                                                    .setAuthor(message.author.tag, message.author.avatarURL)
                                                    .setColor(funcs.rc())
                                                    .setFooter(bot.user.username)
                                                    .setTitle(`Giveaway started!`)
                                                    .addField(`Prize:`, prize)
                                                    .setDescription(giveawayName)
                                                    .addField(`Time:`, time)
                                                    .setThumbnail(message.author.avatarURL);
                                                message.channel.send(embed).then(m => {
                                                    m.react("🎉");
                                                    setTimeout(() => {
                                                        m.reactions.forEach(reaction => {
                                                            con.query(`SELECT * FROM guildGiveaways WHERE guildId = "${message.guild.id}" AND timeId = "${message.createdTimestamp.toString()}"`, (e, row) => {
                                                                if (!row || row.length == 0) {
                                                                    return con.query(`DELETE FROM guildGiveaways WHERE guildId ="${message.guild.id}" AND timeId ="${message.createdTimestamp.toString()}"`);
                                                                }
                                                                if (row[0].giveawayRunning == 0) {
                                                                    return con.query(`DELETE FROM guildGiveaways WHERE guildId ="${message.guild.id}" AND timeId ="${message.createdTimestamp.toString()}"`);
                                                                }
                                                                if (reaction.emoji.name !== "🎉") return;
                                                                reaction.fetchUsers().then(async users => {
                                                                    users = users.filter(u => !u.bot);
                                                                    if (users.size == 0) {
                                                                        funcs.send(`No users reacted. Giveaway ended!`);
                                                                        const newEmbed = new RichEmbed()
                                                                            .setAuthor(message.author.tag, message.author.avatarURL)
                                                                            .setColor(funcs.rc())
                                                                            .setFooter(bot.user.username)
                                                                            .setTitle(`Giveaway has ended.`)
                                                                            .addField(`Prize:`, prize)
                                                                            .addField(`Winners:`, `No winners.`)
                                                                            .setDescription(giveawayName)
                                                                            .addField(`Time:`, ms(time))
                                                                            .setThumbnail(message.author.avatarURL);
                                                                        m.edit(newEmbed);
                                                                        return con.query(`DELETE FROM guildGiveaways WHERE guildId ="${message.guild.id}" AND timeId ="${message.createdTimestamp.toString()}"`);
                                                                    }
                                                                    const usersWon = users.random(row[0].winnerCount);
                                                                    funcs.send(`Congratulations, ${usersWon.map(u => u.tag).join(", ")}, you have won!`);
                                                                    const newEmbed = new RichEmbed()
                                                                        .setAuthor(message.author.tag, message.author.avatarURL)
                                                                        .setColor(funcs.rc())
                                                                        .setFooter(bot.user.username)
                                                                        .setTitle(`Giveaway has ended.`)
                                                                        .addField(`Prize:`, prize)
                                                                        .addField(`Winners:`, usersWon.map(u => u.tag).join(', '))
                                                                        .setDescription(giveawayName)
                                                                        .addField(`Time:`, ms(time))
                                                                        .setThumbnail(message.author.avatarURL);
                                                                    m.edit(newEmbed);
                                                                    con.query(`DELETE FROM guildGiveaways WHERE guildId ="${message.guild.id}" AND timeId ="${message.createdTimestamp.toString()}"`);
                                                                    var interval;
                                                                    var reroll = async function () {
                                                                        interval = await setInterval(() => {
                                                                            message.channel.send(`**__Say reroll to reroll or exit to finsh the giveaway.__**`)
                                                                                .then((m1) => {
                                                                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                                                        max: 1,
                                                                                        time: 30000,
                                                                                        errors: ['time'],
                                                                                    })
                                                                                        .then((resp) => {
                                                                                            if (!resp) return;
                                                                                            resp = resp.array()[0];
                                                                                            if (resp.content.toLowerCase().includes("reroll")) {
                                                                                                const usersWon = users.random(row[0].winnerCount);
                                                                                                funcs.send(`Congratulations, ${usersWon.map(u => u.tag).join(", ")}, you have won!`);;
                                                                                                const newEmbed = new RichEmbed()
                                                                                                    .setAuthor(message.author.tag, message.author.avatarURL)
                                                                                                    .setColor(funcs.rc())
                                                                                                    .setFooter(bot.user.username)
                                                                                                    .setTitle(`Giveaway has ended.`)
                                                                                                    .addField(`Prize:`, prize)
                                                                                                    .addField(`Winners:`, usersWon.map(u => u.tag).join(', '))
                                                                                                    .setDescription(giveawayName)
                                                                                                    .addField(`Time:`, time)
                                                                                                    .setThumbnail(message.author.avatarURL);
                                                                                                m.edit(newEmbed);
                                                                                                m1.delete();
                                                                                                clearInterval(interval);
                                                                                                reroll();
                                                                                            } else if (resp.content.toLowerCase().includes("exit")) {
                                                                                                clearInterval(interval);
                                                                                            } else {
                                                                                                clearInterval(interval);
                                                                                            }
                                                                                        })
                                                                                        .catch((e) => {
                                                                                            console.log(e);
                                                                                            send(`Time has expired.`);
                                                                                            clearInterval(interval);
                                                                                        });
                                                                                });
                                                                            clearInterval(interval);
                                                                        }, ms('1s'));
                                                                    };
                                                                    reroll();
                                                                });
                                                            });
                                                        });
                                                    }, timeMs);
                                                });
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
            });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "startgiveaway",
    aliases: [],
    usage: "Use this command to start a giveaway.",
    commandCategory: "fun",
    cooldownTime: '0'
};