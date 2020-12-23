const { richEmbed } = require('discord.js');
module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT cn.caseNumber, gs.logsEnabled, gp.prefix, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildPrefix AS gp ON cn.guildId = gp.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
        con.query(`SELECT * FROM guildModMail WHERE guildId ="${message.guild.id}"`, (e, modmail) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                row = row[0];
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                modmail = modmail[0];
                message.channel.send(`__**What would you like to do?**__\n\`\`\`Set modmail channel (type 1)\nConfigure modmail mode (type 2) Type exit to cancel.\`\`\``).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        if (response == "exit") return funcs.send(`Command canceled!`);
                        if (response == "1") {
                            if (modmail.mode == "dm") return funcs.send(`Modmail mode is currently set to DM. Cannot set a channel while that is true.`);
                            message.channel.send(`__**What channel would you like to set modmail to?**__`).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    response = response.array()[0].content;
                                    const channel = message.guild.channels.find(c => c.name == response);
                                    if (!channel) return funcs.send(`Could not find a channel with that name.`);
                                    if (modmail.channel == channel.name) return funcs.send(`Channel is already set to that!`);
                                    funcs.send(`Channel successfully set!`);
                                    con.query(`UPDATE guildModMail SET channel ="${channel.name}" WHERE guildId ="${message.guild.id}"`);
                                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                    if (row.logsEnabled !== "true") return;
                                    let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                    if (!finder) return;
                                    let embed = new richEmbed()
                                        .setTitle(`Modmail Channel Changed.`)
                                        .setTimestamp()
                                        .setAuthor(message.author.username, message.author.avatarURL)
                                        .setThumbnail(bot.user.avatarURL)
                                        .setColor(funcs.rc())
                                        .addField(`Channel:`, channel)
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
                        } else if (response == "2") {
                            message.channel.send(`__**What would you like to do?**__\n\`\`\`Set modmail mode to DM (type 1)\nSet modmail mode to channel (type 2)\nType exit to cancel.\`\`\``).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    response = response.array()[0].content;
                                    if (response == "exit") return funcs.send(`Command canceled!`);
                                    if (response == "1") {
                                        if (modmail.mode == "dm") return funcs.send(`Mode is already set to DM!`);
                                        funcs.send(`Mode successfully updated.`);
                                        con.query(`UPDATE guildModMail SET mode ="dm" WHERE guildId ="${message.guild.id}"`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new richEmbed()
                                            .setTitle(`Modmail Mode Changed.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Mode:`, "dm")
                                            .addField(`Changed by:`, message.author.username)
                                            .addField(`Changed at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    } else if (response == "2") {
                                        if (modmail.mode == "channel") return funcs.send(`Mode is already set to channel!`);
                                        funcs.send(`Mode successfully updated.`);
                                        con.query(`UPDATE guildModMail SET mode ="channel" WHERE guildId ="${message.guild.id}"`);
                                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                        if (row.logsEnabled !== "true") return;
                                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                        if (!finder) return;
                                        let embed = new richEmbed()
                                            .setTitle(`Modmail Mode Changed.`)
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField(`Mode:`, "channel")
                                            .addField(`Changed by:`, message.author.username)
                                            .addField(`Changed at`, message.createdAt.toDateString())
                                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                            .addField(`Message:`, `[JumpTo](${message.url})`);
                                        message.guild.channels.get(finder.id).send(embed);
                                    }
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
        });
    });
};

module.exports.config = {
    name: "modmail",
    aliases: [],
    usage: "Use this command to configure modmail.",
    commandCategory: "moderation",
    cooldownTime: "0"
};
