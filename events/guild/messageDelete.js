const f = require('../../handlers/funcs.js');
const { richEmbed } = require('discord.js');
const { dbConnect } = require('./../../handlers/dbConnection.js');

let con;
con = dbConnect();


module.exports = (bot, message) => {
    if (message.channel.type === 'dm') return;
    const funcs = new f(message);
    con.query(`SELECT gd.events, gs.clogsEnabled, gs.clogsChannel FROM guildDisabledSettings AS gd  LEFT JOIN guildSettings AS gs ON gd.guildId = gs.guildId WHERE gd.guildId ="${message.guild.id}"`, (e, row) => {
        row = row[0];
        if (row.events.includes("messageDelete")) return;
        if (row.clogsEnabled == "false") return;
        const messFix = message.cleanContent
        if (messFix.length <= 0) return;
        const channel = message.guild.channels.find(c => c.name == row.clogsChannel);
        if (!channel) return;
        if (message.attachments.size > 0) {
            try {
                message.attachments.forEach(a => {
                    const embed = new richEmbed()
                        .setColor(funcs.rc())
                        .setTitle(`:x: Image Deleted! :x:`)
                        .addField(`Deleted by:`, message.author.username + ` (ID: ${message.author.id})`)
                        .addField(`Deleted in:`, message.channel.name, true)
                        .setImage(a.proxyURL)
                        .addField(`Deleted at:`, new Date().toDateString(), true)
                        .setFooter(bot.user.username)
                    message.guild.channels.get(channel.id).send(embed);
                })
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                const embed = new richEmbed()
                    .setColor(funcs.rc())
                    .setTitle(`:x: Message Deleted! :x:`)
                    .addField(`Deleted by:`, message.author.username + ` (ID: ${message.author.id})`)
                    .addField(`Deleted in:`, message.channel.name, true)
                    .addField(`Message:`, messFix.substr(0, 600))
                    .addField(`Deleted at:`, new Date().toDateString(), true)
                    .setFooter(bot.user.username)
                    .setThumbnail(message.author.avatarURL);
                message.guild.channels.get(channel.id).send(embed);
            } catch (err) {
                console.log(err)
            }
        }
    });
};