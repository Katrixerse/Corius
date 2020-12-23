const { MessageEmbed } = require('discord.js');
const moment = require('moment');
var cats = ['moderation', 'fun', 'economy', 'miscellaneous', 'music', 'search', 'rpg', 'roleplay', 'leveling', 'info', 'canvas', 'teams', 'nsfw', 'reddit'];
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        const rs = funcs.rc();
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel, gds.categories FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId, guildDisabledSettings AS gds ON gds.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
            row = row[0];
            if (!message.member.hasPermission(`ADMINISTRATOR`)) return funcs.send(`You need the ADMINISTRATOR permission to use this command.`);
            message.channel.send(`__**What would you like to do?**__\n\`\`\`Enable a category (current categories are ${cats.map(c => c).join(", ")}) (type 1)\nDisable a category (type 2)\n\n\nType exit to cancel\`\`\``)
                .then(() => {
                    message.channel.awaitMessages(m => m.author.id = message.author.id, {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                        .then((resp) => {
                            if (!resp) return;
                            resp = resp.array()[0].content;
                            if (resp === `1`) {
                                message.channel.send(`__**Now type the category you would like to enable**__`)
                                    .then(() => {
                                        message.channel.awaitMessages(m => m.author.id = message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                            .then((categorytoenable) => {
                                                if (!categorytoenable) return;
                                                categorytoenable = categorytoenable.array()[0].content;
                                                if (categorytoenable.toLowerCase() == "fun") {
                                                    if (!row.categories.includes(`fun`)) return funcs.send(`Fun is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("fun")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Fun has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "moderation") {
                                                    if (!row.categories.includes(`moderation`)) return funcs.send(`Moderation is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("moderation")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Moderation has been enabled.`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setFooter(moment().calendar())
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "economy") {
                                                    if (!row.categories.includes(`economy`)) return funcs.send(`Economy is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("economy")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Economy has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "roleplay") {
                                                    if (!row.categories.includes(`roleplay`)) return funcs.send(`Roleplay is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("roleplay")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Roleplay has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "reddit") {
                                                    if (!row.categories.includes(`reddit`)) return funcs.send(`Reddit is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("reddit")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Reddit has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "nsfw") {
                                                    if (!row.categories.includes(`nsfw`)) return funcs.send(`Nsfw is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("nsfw")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Nsfw has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "canvas") {
                                                    if (!row.categories.includes(`canvas`)) return funcs.send(`Canvas is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("canvas")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Canvas has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "leveling") {
                                                    if (!row.categories.includes(`leveling`)) return funcs.send(`Leveling is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("leveling")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Leveling has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "teams") {
                                                    if (!row.categories.includes(`teams`)) return funcs.send(`Teams is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("teams")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Teams has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "info") {
                                                    if (!row.categories.includes(`info`)) return funcs.send(`Info is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("info")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Info has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "miscellaneous") {
                                                    if (!row.categories.includes(`miscellaneous`)) return funcs.send(`Miscellaneous is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("miscellaneous")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Miscellaneous has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "music") {
                                                    if (!row.categories.includes(`music`)) return funcs.send(`Music is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("music")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Music has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "search") {
                                                    if (!row.categories.includes(`search`)) return funcs.send(`Search is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("search")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Search has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "rpg") {
                                                    if (!row.categories.includes(`rpg`)) return funcs.send(`RPG is already enabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories.split("rpg")}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`RPG has been enabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has enabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else {
                                                    funcs.send(`Command canceled.`);
                                                }
                                            })
                                            .catch((e) => {
                                                console.log(e);
                                                funcs.send(`Time has expired.`);
                                            });
                                    });
                            } else if (resp == `2`) {
                                message.channel.send(`__**Now type the category you would like to disable**__`)
                                    .then(() => {
                                        message.channel.awaitMessages(m => m.author.id = message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time'],
                                        })
                                            .then((categorytoenable) => {
                                                if (!categorytoenable) return;
                                                categorytoenable = categorytoenable.array()[0].content;
                                                if (categorytoenable.toLowerCase() == "fun") {
                                                    if (row.categories.includes(`fun`)) return funcs.send(`Fun is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "fun" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Fun has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "moderation") {
                                                    if (row.categories.includes(`moderation`)) return funcs.send(`Moderation is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "moderation" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Moderation has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, row.caseNumber)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "reddit") {
                                                    if (row.categories.includes(`reddit`)) return funcs.send(`Reddit is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "reddit" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Reddit has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "nsfw") {
                                                    if (row.categories.includes(`nsfw`)) return funcs.send(`Nsfw is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "nsfw" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Nsfw has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "economy") {
                                                    if (row.categories.includes(`economy`)) return funcs.send(`Ecnonomy is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "economy" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Economy has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "roleplay") {
                                                    if (row.categories.includes(`roleplay`)) return funcs.send(`Roleplay is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "roleplay" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Roleplay has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "canvas") {
                                                    if (row.categories.includes(`canvas`)) return funcs.send(`Canvas is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "canvas" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Canvas has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "leveling") {
                                                    if (row.categories.includes(`leveling`)) return funcs.send(`Leveling is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "leveling" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Leveling has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase().includes("teams")) {
                                                    if (row.categories.includes(`teams`)) return funcs.send(`Teams is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "teams" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Teams has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "miscellaneous") {
                                                    if (row.categories.includes(`miscellaneous`)) return funcs.send(`Miscellaneous is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "miscellaneous" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Miscellaneous has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "music") {
                                                    if (row.categories.includes(`music`)) return funcs.send(`Music is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "music" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Music has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "info") {
                                                    if (row.categories.includes(`info`)) return funcs.send(`Info is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "info" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Info has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "leveling") {
                                                    if (row.categories.includes(`leveling`)) return funcs.send(`Leveling is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "leveling" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Leveling has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "rpg") {
                                                    if (row.categories.includes(`rpg`)) return funcs.send(`RPG is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "rpg" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`RPG has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else if (categorytoenable.toLowerCase() == "search") {
                                                    if (row.categories.includes(`search`)) return funcs.send(`Search is already disabled.`);
                                                    con.query(`UPDATE guildDisabledSettings SET categories = "${row.categories + "search" + ","}" WHERE guildId = ${message.guild.id}`);
                                                    funcs.send(`Search has been disabled.`);
                                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                    if (row.logsEnabled !== "true") return;
                                                    let embed = new MessageEmbed()
                                                        .setAuthor(message.author.username, message.author.avatarURL)
                                                        .setColor(rs)
                                                        .setDescription(`${message.author.username} has disabled a category.`)
                                                        .addField(`Category:`, categorytoenable)
                                                        .setFooter(moment().calendar())
                                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                        .setThumbnail(bot.user.avatarURL);
                                                    let modlogs = message.guild.channels.find(name => name.name == row.logsChannel);
                                                    if (!modlogs) return;
                                                    message.guild.channels.get(modlogs.id).send(embed);
                                                } else {
                                                    funcs.send(`Not a valid category.`);
                                                }
                                            })
                                            .catch((e) => {
                                                console.log(e);
                                                funcs.send(`Time has expired.`);
                                            });
                                    });
                            }
                        })
                        .catch((e) => {
                            console.log(e);
                            funcs.send(`Time has expired.`);
                        });
                });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "managecategory",
    aliases: ["mct"],
    usage: "Enable/Disable a category of commands.",
    commandCategory: "moderation",
    cooldownTime: "5"
};