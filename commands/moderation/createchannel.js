const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gp.prefix, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildPrefix AS gp ON cn.guildId = gp.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                row = row[0];
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_CHANNELS";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                message.channel.send(`__**What would you like your channel to be named?**__`).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        const channelName = response.substr(0, 50);
                        message.channel.send(`__**What type would you like it to be? (text | voice | category)**__`).then(() => {
                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                errors: ["time"],
                                time: 30000
                            }).then((response) => {
                                response = response.array()[0].content;
                                if (response !== "voice" && response !== "text" && response !== "category") return funcs.send(`Not a valid type.`);
                                message.guild.createChannel(channelName, { type: response });
                                funcs.send(`Channel has been created.`);
                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                if (row.logsEnabled !== "true") return;
                                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                                if (!finder) return;
                                let embed = new richEmbed()
                                    .setTitle(`Channel Created.`)
                                    .setTimestamp()
                                    .setAuthor(message.author.username, message.author.avatarURL)
                                    .setThumbnail(bot.user.avatarURL)
                                    .setColor(funcs.rc())
                                    .addField(`Name:`, channelName)
                                    .addField(`Type:`, response)
                                    .addField(`Created by:`, message.author.username)
                                    .addField(`Created at`, message.createdAt.toDateString())
                                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                    .addField(`Message:`, `[JumpTo](${message.url})`);
                                message.guild.channels.get(finder.id).send(embed);
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
    name: "createchannel",
    aliases: [],
    usage: "Use this command to create a channel.",
    commandCategory: "moderation",
    cooldownTime: '0'
};