const { richEmbed } = require('discord.js');
const f = require('../../handlers/funcs.js');
const { dbConnect } = require('./../../handlers/dbConnection.js');

let con;
con = dbConnect();

module.exports = (bot, message, newMessage) => {
    if (newMessage.author.bot) return;
    if (message.content === newMessage.content) return;
    const funcs = new f(message);
    con.query(`SELECT gd.events, gs.clogsEnabled, gs.clogsChannel FROM guildDisabledSettings AS gd LEFT JOIN guildSettings AS gs ON gs.guildId = gd.guildId WHERE gd.guildId ="${message.guild.id}"`, (e, row) => {
        row = row[0];
        if (row.events.includes("messageUpdate")) return;
        if (row.clogsEnabled == "false") return;
        const channel = message.guild.channels.find(c => c.name == row.clogsChannel);
        if (!channel) return;
        if (message.content.startsWith("http") || message.content.startsWith("https")) return;
        const embed = new richEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor(funcs.rc())
            .setTitle(`:pencil: Message Edited! :pencil:`)
            .addField(`Edited by:`, message.author.username + ` (ID: ${message.author.id})`)
            .addField(`Edited in:`, message.channel.name, true)
            .addField(`Before:`, message.content)
            .addField(`After:`, newMessage.content)
            .addField(`Edited at:`, new Date().toDateString(), true)
            .setFooter(bot.user.username)
            .setThumbnail(message.author.avatarURL);
        message.guild.channels.get(channel.id).send(embed);
    });
};
