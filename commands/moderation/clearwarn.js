const { MessageEmbed } = require("discord.js");
module.exports.run = (bot, message, args, funcs, con) => {
    const permissionNeeded = `MANAGE_GUILD`;
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
        let row1 = rows.map(r => r.guildMods);
        if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You are missing the ${permissionNeeded} permission to use this command!`, true);
        const user = message.mentions.members.first();
        if (!user) return funcs.send(`You did not mention a user to manage their warns!`, true, 6000);
        con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${user.id}"`, (e, rows) => {
            if (!rows || rows.length == 0) return funcs.send(`User has no warnings!`);
            message.channel.send(`__**What would you like to do?**__\n\`\`\`Clear all warnings (say 1)\nClear a specific warning (say 2)\nExit (say 3)\`\`\``).then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    errors: ["time"],
                    time: 30000
                }).then((response) => {
                    response = response.array()[0].content;
                    if (response == "1") {
                        con.query(`DELETE FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${user.id}"`);
                        funcs.send(`All warnings successfully cleared!`, false);
                        con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
                            row = row[0];
                            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                            const LogsEmbed = new MessageEmbed()
                                .setTitle(`:warning: Member Warnings Cleared :warning:`)
                                .setAuthor(message.author.tag, message.author.avatarURL)
                                .addField(`Member moderated:`, user.user.username)
                                .addField(`Moderated by:`, message.author.username)
                                .addField(`Moderated at:`, new Date().toDateString())
                                .addField(`Warnings cleared:`, `All`)
                                .addField(`Message:`, `[JumpTo](${message.url})`)
                                .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                                .setColor(funcs.rc())
                                .setThumbnail(message.author.avatarURL)
                                .setFooter(bot.user.username);
                            if (row.logsEnabled !== "true") return;
                            const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
                            if (logsChannel === undefined) return;
                            message.guild.channels.get(logsChannel.id).send(LogsEmbed);
                        });
                    } else if (response == "2") {
                        const embed = new MessageEmbed()
                            .setTitle(`${user.user.username}'s warns`)
                            .setColor(funcs.rc())
                            .setThumbnail(user.user.avatarURL);
                        con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${user.id}"`, (e, rows) => {
                            let n = 0;
                            if (!rows || rows.length == 0) return funcs.send(`User has no warns.`, true);
                            rows.forEach(row => {
                                embed.addField(`${n += 1}#:`, `Warning reason: ${row.warning}\nWarned by: ${row.warnedBy}\nWarned at: ${row.warnedAt}`);
                            });
                            embed.setDescription(`Which warning would you like to remove? (type the number of the warning)`);
                            message.channel.send(embed).then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    errors: ["time"],
                                    time: 30000
                                }).then((response) => {
                                    let numberPicked = parseInt(response.array()[0].content);
                                    if (isNaN(numberPicked)) return funcs.send(`Not a valid number!`);
                                    if (numberPicked > rows.length || (numberPicked < 0)) return funcs.send(`Not a valid number!`);
                                    embed.fields.forEach(field => {
                                        if (field.name.startsWith(numberPicked.toString())) {
                                            const warnPicked = field.value.split("\n")[0];
                                            const warnText = warnPicked.split("Warning reason: ").join("");
                                            con.query(`DELETE FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${user.id}" AND warning ="${warnText}"`);
                                            funcs.send(`Warning successfully cleared!`);
                                            con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
                                                row = row[0];
                                                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                                                const LogsEmbed = new MessageEmbed()
                                                    .setTitle(`:warning: Member Warnings Cleared :warning:`)
                                                    .setAuthor(message.author.tag, message.author.avatarURL)
                                                    .addField(`Member moderated:`, user.user.username)
                                                    .addField(`Moderated by:`, message.author.username)
                                                    .addField(`Moderated at:`, new Date().toDateString())
                                                    .addField(`Warnings cleared:`, `${warnText}`)
                                                    .addField(`Message:`, `[JumpTo](${message.url})`)
                                                    .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                                                    .setColor(funcs.rc())
                                                    .setThumbnail(message.author.avatarURL)
                                                    .setFooter(bot.user.username);
                                                if (row.logsEnabled !== "true") return;
                                                const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
                                                if (logsChannel === undefined) return;
                                                message.guild.channels.get(logsChannel.id).send(LogsEmbed);
                                            });
                                        }
                                    });
                                }).catch((e) => {
                                    funcs.send(`You ran out of time or an error occured!`);
                                    console.log(`Error: ${e.message} in guild ${message.guild.name} command clearwarn`);
                                });
                            });
                        });
                    } else {
                        funcs.send(`Command canceled.`);
                    }
                }).catch((e) => {
                    funcs.send(`You ran out of time or an error occured!`);
                    console.log(`Error: ${e.message} in guild ${message.guild.name} command clearwarn`);
                });
            });
        });
    });
};

module.exports.config = {
    name: "clearwarn",
    aliases: [],
    usage: "Manages the warnings of a user.",
    commandCategory: "moderation",
    cooldownTime: '0'
};