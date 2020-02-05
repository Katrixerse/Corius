const { RichEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        if (!message.member.hasPermission(`ADMINISTRATOR`, false, true, true)) return funcs.send(`Only admins can use this command! (ADMINISTRATOR)`);
        con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
            message.channel.send(`__**What would you like to do?**__\n\`\`\`Promote someone to moderator (say 1)\nDemote someone from moderator (say 2) (type exit to cancel)\nView the current mods (say 3)\`\`\``).then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    errors: ["time"],
                    time: 30000
                }).then((response) => {
                    response = response.array()[0].content;
                    if (response == "1") {
                        message.channel.send(`__**Who would you like to make mod? (mention)**__`).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                const userToMakeMod = response.array()[0].mentions.members.first();
                                if (!userToMakeMod) return funcs.send(`Not a valid mention!`);
                                const guildMods = rows.map(r => r.guildMods);
                                //if (!userToMakeMod) return funcs.send(`You didn't mention a user to make moderator!`);
                                if (userToMakeMod.id == message.author.id || userToMakeMod.user.bot) return funcs.send(`Not a valid user!`);
                                if (userToMakeMod.highestRole.position >= message.member.highestRole.position) return funcs.send(`That user has a higher or the same position as you!`, true);
                                if (guildMods.includes(userToMakeMod.id)) return funcs.send(`That user is already a mod!`);
                                con.query(`INSERT INTO guildModerators (guildId, guildMods) VALUES (?, ?)`, [message.guild.id, userToMakeMod.id]);
                                funcs.send(`User has been added as mod!`, false);
                                con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
                                    row = row[0];
                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                    const LogsEmbed = new RichEmbed()
                                        .setTitle(`:arrow_up: Member Promoted To Mod :arrow_up:`)
                                        .setAuthor(message.author.tag, message.author.avatarURL)
                                        .addField(`Member promoted:`, userToMakeMod.user.username)
                                        .addField(`Promoted by:`, message.author.username)
                                        .addField(`Promoted at:`, new Date().toDateString())
                                        .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                                        .setColor(funcs.rc())
                                        .setFooter(bot.user.username);
                                    if (row.logsEnabled !== "true") return;
                                    const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
                                    if (logsChannel === undefined) return;
                                    message.guild.channels.get(logsChannel.id).send(LogsEmbed);
                                });
                            }).catch((e) => {
                                funcs.send(`You ran out of time or an error occured!`);
                                console.log(`Error: ${e.message} in guild ${message.guild.name} command managemods`);
                            });
                        });
                    } else if (response == "2") {
                        message.channel.send(`__**Who would you like to demote from mod? (mention)**__`).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                const userToMakeMod = response.array()[0].mentions.members.first();
                                if (!userToMakeMod) return funcs.send(`Not a valid mention!`);
                                const guildMods = rows.map(r => r.guildMods);
                                //if (!userToMakeMod) return funcs.send(`You didn't mention a user to make moderator!`);
                                if (userToMakeMod.id == message.author.id || userToMakeMod.user.bot) return funcs.send(`Not a valid user!`);
                                if (userToMakeMod.highestRole.position >= message.member.highestRole.position) return funcs.send(`That user has a higher or the same position as you!`, true);
                                if (!guildMods.includes(userToMakeMod.id)) return funcs.send(`That user is not a mod!`);
                                con.query(`DELETE FROM guildModerators WHERE guildId ="${message.guild.id}" AND guildMods ="${userToMakeMod.id}"`);
                                funcs.send(`User has been demoted from mod!`, false);
                                con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
                                    row = row[0];
                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                    const LogsEmbed = new RichEmbed()
                                        .setTitle(`:arrow_down: Member Demoted From Mod :arrow_down:`)
                                        .setAuthor(message.author.tag, message.author.avatarURL)
                                        .addField(`Member demoted:`, userToMakeMod.user.username)
                                        .addField(`Demoted by:`, message.author.username)
                                        .addField(`Demoted at:`, new Date().toDateString())
                                        .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                                        .setColor(funcs.rc())
                                        .setFooter(bot.user.username);
                                    if (row.logsEnabled !== "true") return;
                                    const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
                                    if (logsChannel === undefined) return;
                                    message.guild.channels.get(logsChannel.id).send(LogsEmbed);
                                });
                            }).catch((e) => {
                                funcs.send(`You ran out of time or an error occured!`);
                                console.log(`Error: ${e.message} in guild ${message.guild.name} command managemods`);
                            });
                        });
                    } else if (response == "3") {
                        if (rows.size == 0) return funcs.send(`No mods to view!`);
                        const embed = new RichEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setColor(funcs.rc())
                            .setFooter(bot.user.username)
                            .setThumbnail(message.author.avatarURL);
                        let n = 0;
                        rows.forEach(row => {
                            embed.addField(`${n += 1}#:`, message.guild.members.find(m => m.id == row.guildMods) == null ? `Mod not found in the server! (ID: ${row.guildMods})` : message.guild.members.find(m => m.id == row.guildMods).user.tag + ` (ID: ${row.guildMods})`);
                        });
                        n = 0;
                        message.channel.send(embed);
                    } else if (response == "exit") {
                        funcs.send(`Command canceled!`, false);
                    } else {
                        funcs.send(`Command canceled!`, false);
                    }
                }).catch((e) => {
                    funcs.send(`You ran out of time or an error occured!`);
                    console.log(`Error: ${e.message} in guild ${message.guild.name} command managemods`);
                });
            });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "managemods",
    aliases: ["mm"],
    usage: "Use this command to add a mod to the guild's moderators (that can use some moderation commands), or remove one.",
    commandCategory: "moderation",
    cooldownTime: '5'
};