const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        const {
            body
        } = await request
            .get("https://www.rrrather.com/botapi");
        if (body.nsfw == true) return funcs.send(`Not allowed to send a NSFW WuR question in a SFW channel.`);
        let embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURl)
            .setThumbnail(bot.user.avatarURL)
            .setTitle(body.title)
            .addField(`A:`, body.choicea)
            .setURL(body.link)
            .setFooter(`Tags: ` + body.tags)
            .addField(`B:`, body.choiceb)
            .setColor(funcs.rc())
            .setTimestamp();
        message.channel.send(embed).then(m => {
            m.react('🅰');
            m.react('🅱');
        });
    } catch (err) {
        if (err.status === 404) return funcs.send('Could not find any results.');
        if (err.status === 522) return funcs.send('Could not find any results.');
        console.log(err);
        return funcs.send(`Oh no! An error occurred! \`${err.message}\`.`);
    }
};

module.exports.config = {
    name: "wur",
    aliases: [''],
    usage: "Play would you rather with the bot.",
    commandCategory: "fun",
    cooldownTime: "3"
  };