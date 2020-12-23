const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        const embed = new richEmbed()
            .setColor(funcs.rc())
            .setTitle('Server Member Info')
            .addField('**__Info:__**', `Online users: ${message.guild.members.filter(m => m.presence.status == "online").size}\nOffline users: ${message.guild.members.filter(m => m.presence.status == "offline").size}\nTotal Users: ${message.guild.members.size}\nTotal Bots: ${message.guild.members.filter(m => m.user.bot == true).size}`)
        message.channel.send(embed);
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "memberinfo",
    aliases: [""],
    usage: "Use this command to get the guild's member information.",
    commandCategory: "info",
    cooldownTime: "5"
};