const { richEmbed } = require('discord.js');
const Funcs = require('./../../assets/exports/funcs');
const { dbConnect } = require('./../../assets/handlers/dbConnection.js');

let con;
con = dbConnect();

module.exports = (bot, reaction, user) => {
    if (reaction.emoji.name == "⭐") {
        con.query(`SELECT * FROM guildStarBoard WHERE guildId ="${reaction.message.guild.id}"`, (e, row) => {
            row = row[0];
            if (row.starBoardEnabled == "false") return;
            const rmessage = reaction.message;
            const starBoardChannel = reaction.message.guild.channels.find(c => c.name == row.starBoardChannel);
            if (!starBoardChannel) return;
            const firstUser = reaction.users.filter(u => !u.bot && u.id !== rmessage.author.id).first();
            if (!firstUser) return;
            const member = reaction.message.guild.members.find(m => m.id == firstUser.id);
            if (member !== undefined && !member.hasPermission(`MANAGE_GUILD`, false, true, true)) return;
            if (member == undefined) return;
            if (user.id == rmessage.author.id) return;
            const funcs = new Funcs(rmessage);
            let isInChannel = "false";
            starBoardChannel.fetchMessages().then(messages => {
                messages = messages.filter(m => m.embeds !== null && m.embeds.length > 0);
                messages.forEach(message => {
                    if (message.embeds[0].description !== rmessage.content) return;
                    const embed = new richEmbed()
                        .setAuthor(rmessage.author.tag, rmessage.author.avatarURL)
                        .setColor(funcs.rc())
                        .setTitle(`Message Starred`)
                        .addField(`Starred by:`, message.embeds[0].fields[0].value)
                        .addField(`Starred in:`, message.embeds[0].fields[1].value)
                        .addField(`Message by:`, message.embeds[0].fields[2].value)
                        .setDescription(rmessage)
                        .setFooter(`⭐ ${parseInt(message.embeds[0].footer.text.substr(1)) + 1}`)
                        .addField("Message:", `[JumpTo](${message.url})`)
                        .setThumbnail(message.author.avatarURL);
                    isInChannel = "true";
                    return message.edit(embed);
                });
                if (isInChannel == "true") return isInChannel = "false";
                const embed = new richEmbed()
                    .setAuthor(rmessage.author.tag, rmessage.author.avatarURL)
                    .setColor(funcs.rc())
                    .setTitle(`Message Starred`)
                    .addField(`Starred by:`, firstUser.username)
                    .addField(`Starred in:`, rmessage.channel.name)
                    .addField(`Message by:`, rmessage.author.tag)
                    .setDescription(rmessage)
                    .setFooter(`⭐ 1`)
                    .addField("Message:", `[JumpTo](${rmessage.url})`)
                    .setThumbnail(rmessage.author.avatarURL);
                rmessage.guild.channels.get(starBoardChannel.id).send(embed);
            });
        });
    }
}