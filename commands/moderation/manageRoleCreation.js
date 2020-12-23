const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gdcs.rolesEnabled, gp.prefix, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildPrefix AS gp ON cn.guildId = gp.guildId LEFT JOIN guildDisabledCreations AS gdcs ON cn.guildId = gdcs.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
            row = row[0];
            const permissionNeeded = "ADMINISTRATOR";
            if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
            message.channel.send(`__**What would you like to do?**__\n\`\`\`Enable role creation (type 1)\nDisable role creation (type 2) Type exit to cancel.\`\`\``).then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    errors: ["time"],
                    time: 30000
                }).then((response) => {
                    response = response.array()[0];
                    if (response == "1") {
                        if (row.rolesEnabled == "true") return funcs.send(`Role creations are already enabled.`);
                        con.query(`UPDATE guildDisabledCreations SET rolesEnabled ="true" WHERE guildId = ${message.guild.id}`);
                        funcs.send(`Role creation has been enabled.`);
                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                        if (row.logsEnabled !== "true") return;
                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                        if (!finder) return;
                        let embed = new MessageEmbed()
                            .setTitle(`Role Creation Enabled.`)
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
                        if (row.rolesEnabled == "false") return funcs.send(`Role creations are already disabled.`);
                        con.query(`UPDATE guildDisabledCreations SET rolesEnabled ="false" WHERE guildId = ${message.guild.id}`);
                        funcs.send(`Role creation has been disabled.`);
                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                        if (row.logsEnabled !== "true") return;
                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                        if (!finder) return;
                        let embed = new MessageEmbed()
                            .setTitle(`Role Creation Disabled.`)
                            .setTimestamp()
                            .setAuthor(message.author.username, message.author.avatarURL)
                            .setThumbnail(bot.user.avatarURL)
                            .setColor(funcs.rc())
                            .addField(`Disabled by:`, message.author.username)
                            .addField(`Disabled at`, message.createdAt.toDateString())
                            .addField(`Case number:`, `#${row.caseNumber + 1}`)
                            .addField(`Message:`, `[JumpTo](${message.url})`);
                        message.guild.channels.get(finder.id).send(embed);
                    }
                }).catch((e) => {
                    funcs.send(`You ran out of time or an error occured!`);
                    console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                });
            });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "managerolecreation",
    aliases: ['mrc'],
    usage: "Use this command to manage the creation of roles.",
    commandCategory: "moderation",
    cooldownTime: '5'
};