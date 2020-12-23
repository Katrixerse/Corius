const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.rolePersistEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "ADMINISTRATOR";
                if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                message.channel.send(`__**What would you like to do?**__\n\`\`\`Enable rolerpersist (type 1)\nDisable rolepersist (type 2)\nGet information about rolepersist (type 3)\nType exit to cancel.\`\`\``).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = response.array()[0].content;
                        if (response == "1") {
                            if (row.rolePersistEnabled == "true") return funcs.send(`Rolepersist is already enabled!`);
                            con.query(`UPDATE guildSettings SET rolePersistEnabled ="true" WHERE guildId = ${message.guild.id}`);
                            funcs.send(`Rolepersist has been enabled!`);
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            if (row.logsEnabled !== "true") return;
                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                            if (!finder) return;
                            let embed = new richEmbed()
                                .setTitle(`:warning: Rolepersist Enabled. :warning:`)
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
                            if (row.rolePersistEnabled == "false") return funcs.send(`Rolepersist is not enabled!`);
                            con.query(`UPDATE guildSettings SET rolePersistEnabled ="false" WHERE guildId = ${message.guild.id}`);
                            funcs.send(`Rolepersist has been disabled!`);
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            if (row.logsEnabled !== "true") return;
                            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                            if (!finder) return;
                            let embed = new richEmbed()
                                .setTitle(`:warning: Rolepersist Disabled. :warning:`)
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
                            const embed = new richEmbed()
                                .setAuthor(message.author.tag, message.author.avatarURL)
                                .setColor(funcs.rc())
                                .setFooter(bot.user.username)
                                .setTitle(`__**Rolepersist Information**__`)
                                .setDescription(`__**Rolepersist**__ is a feature that will make it so when users leave the server and join again, they will gain the roles that they had when they left back. `)
                                .setThumbnail(message.author.avatarURL);
                            message.channel.send(embed);
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
    name: "rolepersist",
    aliases: ["rp"],
    usage: "Use this command to manage rolepersist.",
    commandCategory: "moderation",
    cooldownTime: '0'
};