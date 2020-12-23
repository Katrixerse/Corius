const { richEmbed } = require('discord.js');
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getEmote(n) {
    n = n.toString();
    const nconv = n.replace(/1/g, ":one:").replace(/2/g, ":two:").replace(/3/g, ":three:").replace(/4/g, ":four:").replace(/5/g, ":five:").replace(/6/g, ":six:").replace(/7/g, ":seven:").replace(/8/g, ":eight:").replace(/9/g, ":nine:").replace(/10/g, ":ten:").replace(/0/g, ":zero:");
    return nconv;
}

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, settings) => {
            if (settings[0].economy == "false") return;
            message.channel.send(`__**What would you like to view the leaderboard for?**__\n\`\`\`Cash (say 1)\nLevels (say 2)\nType exit to cancel.\`\`\``).then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    errors: ["time"],
                    time: 30000
                }).then((response) => {
                    response = response.array()[0];
                    if (response == "1") {
                        message.channel.send(`__**What would you like to see?**__\n\`\`\`Global leaderboard (type 1)\nGuild leaderboard (type 2)\nType exit to cancel.\`\`\``).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                response = response.array()[0].content;
                                if (response == "1") {
                                    con.query(`SELECT * FROM guildCash ORDER BY userCash + userBankedCash DESC LIMIT 10`, (e, row) => {
                                        if (row.length == 0) return funcs.send(`No users have earned any cash yet!`);
                                        const em = new richEmbed()
                                            .setColor(funcs.rc())
                                            .setTimestamp()
                                            .setThumbnail(message.author.avatarURL)
                                        let n = 0;
                                        row.forEach(r => {
                                            if (em.fields.some(f => f.value.includes(r.username))) return;
                                            n += 1;
                                            em.addField(`__**${getEmote(n)}:**__`, `**Username:** ${r.username}\n**Cash:** ${numberWithCommas(r.userCash)}$\n**Bank:** ${numberWithCommas(r.userBankedCash)}$`);
                                        });
                                        em.setTitle(`Top ${n} most rich user(s)`);
                                        n = 0;
                                        message.channel.send(em);
                                    });
                                } else if (response == "2") {
                                    con.query(`SELECT * FROM guildCash WHERE guildId = "${message.guild.id}" ORDER BY userCash + userBankedCash DESC LIMIT 10`, (e, row) => {
                                        if (row.length == 0) return funcs.send(`No users have earned any cash yet!`);
                                        const em = new richEmbed()
                                            .setColor(funcs.rc())
                                            .setTimestamp()
                                            .setThumbnail(message.author.avatarURL)
                                        let n = 0;
                                        row.forEach(r => {
                                            if (em.fields.some(f => f.value.includes(r.username))) return;
                                            n += 1;
                                            em.addField(`__**${getEmote(n)}:**__`, `**Username:** ${r.username}\n**Cash:** ${numberWithCommas(r.userCash)}$\n**Bank:** ${numberWithCommas(r.userBankedCash)}$`);
                                        });
                                        em.setTitle(`Top ${n} most rich user(s)`);
                                        n = 0;
                                        message.channel.send(em);
                                    });
                                } else {
                                    funcs.send(`Command canceled!`);
                                }
                            }).catch((e) => {
                                funcs.send(`You ran out of time or an error occured!`);
                                console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                            });
                        });
                    } else if (response == "2") {
                        message.channel.send(`__**What would you like to see?**__\n\`\`\`Global leaderboard (type 1)\nGuild leaderboard (type 2)\nType exit to cancel.\`\`\``).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                response = response.array()[0].content;
                                if (response == "1") {
                                    con.query(`SELECT * FROM guildLeveling ORDER BY userPrestige DESC, userLevel DESC, userXP DESC LIMIT 10`, (e, row) => {
                                        if (row.length == 0) return funcs.send(`No users have earned any xp yet!`);
                                        const em = new richEmbed()
                                            .setColor(funcs.rc())
                                            .setTimestamp()
                                            .setThumbnail(message.author.avatarURL)
                                        let n = 0;
                                        row.forEach(r => {
                                            if (em.fields.some(f => f.value.includes(r.username))) return;
                                            n += 1;
                                            em.addField(`__**${getEmote(n)}:**__`, `**Username:** ${r.username}\n**Prestige** ${r.userPrestige}\n**Level:** ${r.userLevel}\n**XP:** ${r.userXP}/${r.userLevel * 400}\n`);
                                        });
                                        em.setTitle(`Top ${n} user(s) with most levels`);
                                        n = 0;
                                        message.channel.send(em);
                                    });
                                } else if (response == "2") {
                                    con.query(`SELECT * FROM guildLeveling WHERE guildId = "${message.guild.id}" ORDER BY userPrestige DESC, userLevel DESC, userXP DESC LIMIT 10`, (e, row) => {
                                        if (row.length == 0) return funcs.send(`No users have earned any xp yet!`);
                                        const em = new richEmbed()
                                            .setColor(funcs.rc())
                                            .setTimestamp()
                                            .setThumbnail(message.author.avatarURL)
                                        let n = 0;
                                        row.forEach(r => {
                                            if (em.fields.some(f => f.value.includes(r.username))) return;
                                            n += 1;
                                            em.addField(`__**${getEmote(n)}:**__`, `**Username:** ${r.username}\n**Prestige** ${r.userPrestige}\n**Level:** ${r.userLevel}\n**XP:** ${r.userXP}/${r.userLevel * 400}`);
                                        });
                                        em.setTitle(`Top ${n} user(s) with most levels`);
                                        n = 0;
                                        message.channel.send(em);
                                    });
                                } else {
                                    funcs.send(`Command canceled!`);
                                }
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
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "leaderboard",
    aliases: [],
    usage: "Use this command to view the leaderboard.",
    commandCategory: "economy",
    cooldownTime: '3'
};