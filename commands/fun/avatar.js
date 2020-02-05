const { RichEmbed } = require('discord.js');
module.exports.run = (bot, message, args, funcs) => {
    const person = message.mentions.members.first() || message.member;
    const embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor(funcs.rc())
        .setFooter(bot.user.username)
        .setImage(person.user.avatarURL)
        .setURL(person.user.avatarURL)
        .setTitle(`Download`);
    message.channel.send(embed);
};

module.exports.config = {
    name: "avatar",
    aliases: ["a"],
    usage: "Use this command to access someone's avatar.",
    commandCategory: "fun",
    cooldownTime: '5'
};