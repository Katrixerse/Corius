const { MessageEmbed } = require("discord.js");
module.exports.run = async (bot, message, args, funcs) => {
    try {
        const embed = new MessageEmbed()
            .setColor(funcs.rc())
            .addField("Can upvote the bot at: ", "https://discordbots.org/bot/535162498534473738/vote");
        return message.channel.send(embed);
    } catch (err) {
        console.log(err)
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
    name: "upvote",
    aliases: [''],
    usage: "Upvote the bot",
    commandCategory: "miscellaneous",
    cooldownTime: "0"
  };