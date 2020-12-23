const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                con.query(`SELECT * FROM guildGiveaways WHERE guildId = "${message.guild.id}"`, (e, giveaways) => {
                    let row1 = rows.map(r => r.guildMods);
                    const permissionNeeded = "MANAGE_GUILD";
                    if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                    if (giveaways.length == 0) return funcs.send(`No giveaways to end!`);
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setColor(funcs.rc())
                        .setFooter(bot.user.username)
                        .setDescription(`Which giveaway would you like to end? (type the number) Say exit to cancel.`)
                        .setThumbnail(message.author.avatarURL);
                    let n = 0;
                    giveaways.forEach(giveaway => {
                        embed.addField(`${n += 1}#:`, `Giveaway: ${giveaway.giveawayName}\nTime: ${giveaway.giveawayTime}\nWinner count: ${giveaway.winnerCount}\nID: ${giveaway.timeId}`);
                    });
                    n = 0;
                    message.channel.send(embed).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then((response) => {
                            response = response.array()[0].content;
                            if (response == "exit") return funcs.send(`Command canceled!`);
                            const num = parseInt(response);
                            if (isNaN(num) || num <= 0 || num > giveaways.length) return funcs.send(`Not a valid number!`);
                            embed.fields.forEach(field => {
                                if (field.name.startsWith(num)) {
                                    const giveawayId = field.value.split("\n")[3].split('ID: ').toString().substr(1);
                                    con.query(`DELETE FROM guildGiveaways WHERE guildId = "${message.guild.id}" AND timeId = "${giveawayId}"`);
                                    funcs.send(`Giveaway has been canceled!`);
                                    if (row.logsEnabled !== "true") return;
                                    let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                    if (!finder) return;
                                    let embed = new MessageEmbed()
                                        .setTitle(`Giveaway Canceled.`)
                                        .setTimestamp()
                                        .setAuthor(message.author.username, message.author.avatarURL)
                                        .setThumbnail(bot.user.avatarURL)
                                        .setColor(funcs.rc())
                                        .addField(`Giveaway:`, field.value)
                                        .addField(`Canceled by:`, message.author.username)
                                        .addField(`Canceled at`, message.createdAt.toDateString())
                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                        .addField(`Message:`, `[JumpTo](${message.url})`);
                                    message.guild.channels.get(finder.id).send(embed);
                                }
                            });
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
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
    name: "endgiveaway",
    aliases: [],
    usage: "Use this command to end a giveaway.",
    commandCategory: "fun",
    cooldownTime: '0'
};