const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.twoFAEnabled, gs.twoFAPass, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                message.channel.send(`__**What would you like to do?**__\n\`\`\`Enable 2-factor server security (type 1)\nDisable 2-factor server security (type 2)\nChange the password for 2-factor server security (type 3)\nGet information about 2-factor server security (type 4)\nType exit to cancel.\`\`\``).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        if (response == "1") {
                            if (row.twoFAEnabled == "true") return funcs.send(`TFSS is already enabled!`);
                            con.query(`UPDATE guildSettings SET twoFAEnabled ="true" WHERE guildId ="${message.guild.id}"`);
                            funcs.send(`TFSS is now enabled!`, false);
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            if (row.logsEnabled !== "true") return;
                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                            if (!finder) return;
                            let embed = new richEmbed()
                                .setTitle(`TFSS Enabled.`)
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
                            if (row.twoFAEnabled == "false") return funcs.send(`TFSS is not enabled!`);
                            con.query(`UPDATE guildSettings SET twoFAEnabled ="false" WHERE guildId ="${message.guild.id}"`);
                            funcs.send(`TFSS is now disabled!`, false);
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            if (row.logsEnabled !== "true") return;
                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                            if (!finder) return;
                            let embed = new richEmbed()
                                .setTitle(`TFSS Disabled.`)
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
                            message.channel.send(`__**What would you like to change the password to?**__`).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    const password = response.array()[0].content;
                                    if (row.twoFAPass == password) return funcs.send(`Password is already set to ${password}!`);
                                    con.query(`UPDATE guildSettings SET twoFAPass ="${password}" WHERE guildId = ${message.guild.id}`);
                                    funcs.send(`Password updated!`);
                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                    if (row.logsEnabled !== "true") return;
                                    let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                    if (!finder) return;
                                    let embed = new richEmbed()
                                        .setTitle(`TFSS Password Updated.`)
                                        .setTimestamp()
                                        .setAuthor(message.author.username, message.author.avatarURL)
                                        .setThumbnail(bot.user.avatarURL)
                                        .setColor(funcs.rc())
                                        .addField(`Updated by:`, message.author.username)
                                        .addField(`Updated at`, message.createdAt.toDateString())
                                        .addField(`Updated to:`, password)
                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                        .addField(`Message:`, `[JumpTo](${message.url})`);
                                    message.guild.channels.get(finder.id).send(embed);
                                }).catch((e) => {
                                    funcs.send(`You ran out of time or an error occured!`);
                                    console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                });
                            });
                        } else if (response == "4") {
                            const embed = new richEmbed()
                                .setAuthor(message.author.tag, message.author.avatarURL)
                                .setColor(funcs.rc())
                                .setFooter(bot.user.username)
                                .setDescription(`**__TFSS (2-factor Server Security)__** is a feature that does not let new users access the server unless they type a password you can set in their DMs. This prevents raids from bots.`)
                                .setThumbnail(message.author.avatarURL);
                            message.channel.send(embed);
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
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "tfss",
    aliases: [],
    usage: "Use this command to manage 2-factor server security.",
    commandCategory: "moderation",
    cooldownTime: '5'
};