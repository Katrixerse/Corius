const { RichEmbed } = require('discord.js');
var things = [
    "heads",
    'tails'
];
module.exports.run = (bot, message, args, funcs) => {
    try {
        const embed = new RichEmbed()
            .setTitle("Coin Flip")
            .setTimestamp()
            .setThumbnail(bot.user.avatarURL)
            .setAuthor(message.author.username)
            .setColor(funcs.rc())
            .addField(`Coin flipped:`, things[Math.floor(Math.random() * things.length)]);
        message.channel.send(embed);
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "coinflip",
    aliases: [],
    usage: "Use this command to flip a coin.",
    commandCategory: "fun",
    cooldownTime: '5'
};