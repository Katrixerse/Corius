const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gst.starBoardEnabled, gst.starBoardChannel, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildStarBoard AS gst ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                message.channel.send(`__**What would you like to do?**__\`\`\`Enable starboard (type 1)\nDisable starboard (type 2)\nChange the starboard channel (type 3)\nType exit to cancel.\`\`\``).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        if (response == "1") {
                            if (row.starBoardEnabled == "true") return funcs.send(`Starboard is already enabled!`);
                            con.query(`UPDATE guildStarBoard SET starBoardEnabled ="true" WHERE guildId = ${message.guild.id}`);
                            funcs.send(`Starboard has been enabled!`);
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            if (row.logsEnabled !== "true") return;
                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                            if (!finder) return;
                            let embed = new RichEmbed()
                                .setTitle(`Starboard Enabled.`)
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
                            if (row.starBoardEnabled == "false") return funcs.send(`Starboard is not enabled!`);
                            con.query(`UPDATE guildStarBoard SET starBoardEnabled ="false" WHERE guildId = ${message.guild.id}`);
                            funcs.send(`Starboard has been disabled!`);
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            if (row.logsEnabled !== "true") return;
                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                            if (!finder) return;
                            let embed = new RichEmbed()
                                .setTitle(`Starboard Disabled.`)
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
                            message.channel.send(`__**Which channel would you like to set starboard to? Say exit to cancel.**__`).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    response = response.array()[0].content;
                                    if (response == 'exit') return funcs.send(`Command canceled!`);
                                    const channel = message.guild.channels.find(c => c.name == response);
                                    if (!channel) return funcs.send(`Could not find that channel!`);
                                    if (row.starBoardChannel == channel.name) return funcs.send(`Channel is already set to ${channel.name}`);
                                    con.query(`UPDATE guildStarBoard SET starBoardChannel ="${channel.name}" WHERE guildId = ${message.guild.id}`);
                                    funcs.send(`Channel updated!`);
                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                    if (row.logsEnabled !== "true") return;
                                    let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                    if (!finder) return;
                                    let embed = new RichEmbed()
                                        .setTitle(`Starboard Channel Updated.`)
                                        .setTimestamp()
                                        .setAuthor(message.author.username, message.author.avatarURL)
                                        .setThumbnail(bot.user.avatarURL)
                                        .setColor(funcs.rc())
                                        .addField(`Channel:`, channel.name)
                                        .addField(`Changed by:`, message.author.username)
                                        .addField(`Changed at`, message.createdAt.toDateString())
                                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                        .addField(`Message:`, `[JumpTo](${message.url})`);
                                    message.guild.channels.get(finder.id).send(embed);
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
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "starboard",
    aliases: [],
    usage: "Use this command to manage starboard.",
    commandCategory: "moderation",
    cooldownTime: '0'
};