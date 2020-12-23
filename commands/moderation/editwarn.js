const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gp.prefix, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildPrefix AS gp ON cn.guildId = gp.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, async (e, rows) => {
                row = row[0];
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                const mem = message.mentions.members.first();
                if (!mem) return funcs.send(`You did not mention anybody to edit their warns!`);
                if (mem.id == message.author.id) return funcs.send(`Cannot edit your warns!`);
                if (message.member.highestRole.position <= mem.highestRole.position || mem.highestRole.position >= message.guild.me.highestRole.position) return funcs.send(`Member has a higher or the same position as you/me`);
                con.query(`SELECT * FROM userWarns WHERE guildId ="${message.guild.id}" AND userId ="${mem.id}"`, (e, rows) => {
                    if (!rows || rows.length == 0) return funcs.send(`User has no warns!`);
                    let n = 0;
                    const embed = new MessageEmbed()
                        .setTitle(`${mem.user.username}'s warns`)
                        .setColor(funcs.rc())
                        .setDescription(`Choose which warn to edit by entering the number of the warn.`)
                        .setThumbnail(mem.user.avatarURL);
                    rows.forEach(row => {
                        embed.addField(`${n += 1}#:`, `Warning reason: ${row.warning}\nWarned by: ${row.warnedBy}\nWarned at: ${row.warnedAt}`);
                    });
                    embed.setAuthor(`Current warn count: ${rows.length}`);
                    message.channel.send(embed).then(() => {
                        message.channel.awaitMessages(m => m.author.id == message.author.id, {
                            errors: ['time'],
                            max: 1,
                            time: 30000
                        }).then((response) => {
                            response = response.array()[0].content;
                            const num = parseInt(response);
                            if (isNaN(num) || num <= 0 || num > rows.length) return funcs.send(`Not a valid number!`);
                            embed.fields.forEach(f => {
                                if (f.name.startsWith(num)) {
                                    const warnPicked = f.value.split("\n")[0];
                                    const warnText = warnPicked.split("Warning reason: ").join("");
                                    message.channel.send(`**__What would you like to set the reason for that warn to?__**`).then(() => {
                                        message.channel.awaitMessages(m => m.author.id == message.author.id, {
                                            errors: ['time'],
                                            max: 1,
                                            time: 30000
                                        }).then((response) => {
                                            response = response.array()[0].content;
                                            const reg = /"+/g;
                                            if (reg.test(response)) return funcs.send(`Reason cannot contain ' " '`);
                                            con.query(`UPDATE userWarns SET warning ="${response}" WHERE guildId = "${message.guild.id}" AND userId = "${mem.id}" AND warning ="${warnText}"`);
                                            funcs.send(`Warning successfully updated!`);
                                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                            const embed = new MessageEmbed()
                                                .setAuthor(message.author.tag, message.author.avatarURL)
                                                .setColor(funcs.rc())
                                                .setFooter(bot.user.username)
                                                .setTitle(`Warn Reason edited`)
                                                .addField(`Edited by:`, `${message.author.tag}`)
                                                .setTimestamp()
                                                .addField(`Original reason:`, warnPicked)
                                                .addField(`New reason:`, response)
                                                .addField(`Case number:`, `#${row.caseNumber + 1}`)
                                                .addField("Message:", `[JumpTo](${message.url})`)
                                                .setThumbnail(message.author.avatarURL);
                                            if (row.logsEnabled !== "true") return;
                                            const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
                                            if (logsChannel === undefined) return;
                                            message.guild.channels.get(logsChannel.id).send(embed);
                                        }).catch((e) => {
                                            funcs.send(`You ran out of time or an error occured!`);
                                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                        });
                                    });
                                }
                            });
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
    name: "editwarn",
    aliases: [],
    usage: "Use this command to edit a warning of a member.",
    commandCategory: "moderation",
    cooldownTime: '5'
};