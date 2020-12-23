const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        const permissionNeeded = "ADMINISTRATOR";
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
            message.channel.send(`**__Which placeholders would you like to see?__**\n\`\`\`User placeholders (say 1)\nServer placeholders (say 2)\nChannel placeholders (say 3)\nFunction placeholders (say 4)\nSay exit to cancel!\`\`\``).then(() => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, {
                    time: 30000,
                    errors: ["time"],
                    max: 1
                }).then(resp => {
                    resp = resp.array()[0].content;
                    if (resp == "1") {
                        const uembed = new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setColor(funcs.rc())
                            .setFooter(bot.user.username)
                            .setTitle(`__**User Placeholders:**__`)
                            .addField(`%NAME%`, `The name of the member that uses the command.`)
                            .addField(`%PING%`, `Pings the member that used the command.`)
                            .addField(`%AUTHORID%`, `The ID of the member using the command.`)
                            .addField(`%MEMBERGAME%`, `The game of the member using the command.`)
                            .addField(`%MEMBERSTATUS%`, `The status of the member using the command.`)
                            .addField(`%MEMBERNICK%`, `The nickname of the member using the command.`)
                            .addField(`%MEMBERJOINED%`, `The date the member using the command joined at.`)
                            .addField(`%ROLENAME%`, `The highest role of the member.`)
                            .setThumbnail(message.author.avatarURL);
                        message.channel.send(uembed);
                    } else if (resp == "2") {
                        const sembed = new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setColor(funcs.rc())
                            .setFooter(bot.user.username)
                            .setTitle(`__**Server Placeholders:**__`)
                            .addField(`%SERVERID%`, `The ID of the server.`)
                            .addField(`%GUILDNAME%`, `The name of the guild.`)
                            .addField(`%GUILDREGION%`, `The region of the guild.`)
                            .addField(`%MEMBERCOUNT%`, `The membercount of the guild.`)
                            .addField(`%CHANNELNAME%`, `The name of the channel the command is executed in.`)
                            .addField(`%OWNERID%`, `The ID of the owner.`)
                            .setThumbnail(message.author.avatarURL);
                        message.channel.send(sembed);
                    } else if (resp == "3") {
                        const cembed = new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setColor(funcs.rc())
                            .setFooter(bot.user.username)
                            .setTitle(`__**Channel Placeholders:**__`)
                            .addField(`%CHANNELMENTION%`, `Mentions the channel the command is executed in.`)
                            .addField(`%CHANNELID%`, `The ID of the channel.`)
                            .setThumbnail(message.author.avatarURL);
                        message.channel.send(cembed);
                    } else if (resp == "4") {
                        const fembed = new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setColor(funcs.rc())
                            .setFooter(bot.user.username)
                            .setTitle(`__**Function Placeholders:**__`)
                            .addField(`%DELETE%`, `If the command output includes this placeholder, the message with the command will get deleted.`)
                            .addField(`{CHANNELMENTION}`, `Replace CHANNELMENTION with the channel to mention. (Example: {general})`)
                            .addField(`{!COMMAND}`, `Replace COMMAND with a command you would like to execute. (case sensitive) (Example: {!ping})`)
                            .addField(`{^ROLE}`, `Replace ROLE with a role you would like to mention. (Example: {^Developer})`)
                            .setThumbnail(message.author.avatarURL);
                        message.channel.send(fembed);
                    } else if (resp == "exit") {
                        return funcs.send("Command canceled!");
                    }
                }).catch((e) => {
                    if (e.message == undefined) {
                        funcs.send(`You ran out of time!`);
                    } else {
                        funcs.send(`Error: ${e.message}`);
                    }
                });
            })
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "placeholders",
    aliases: ["pl"],
    usage: "Use this command to see the placeholders for custom command/responses.",
    commandCategory: "moderation",
    cooldownTime: '5'
};