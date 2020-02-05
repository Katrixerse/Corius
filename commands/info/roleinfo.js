const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
    let roleName = args.join(' ')
    let role = message.guild.roles.find(r => r.name == roleName);
    if (!role) return message.channel.send(`I couldn't find the role: ${roleName} in this server.`);
    try {
        const guild = message.guild;
        const embed = new RichEmbed()
            .setColor(funcs.rc())
            .setTitle('Role Info')
            .addField('**__Info:__**', `Name: ${role.name}\n Role ID: ${role.id}\nColor: ${role.hexColor.toUpperCase()}\nCreated At: ${role.createdAt.toDateString()}\nHoisted: ${role.hoist ? 'Yes' : 'No'}\nMentionable: ${role.mentionable ? 'Yes' : 'No'}`)
        message.channel.send(embed);
    } catch (e) {
        console.log(e);
        send(`Oh no, an error occurred!\n${e.message}`);
    }
};

module.exports.config = {
    name: "roleinfo",
    aliases: [""],
    usage: "Use this command to get information on a role.",
    commandCategory: "info",
    cooldownTime: "5"
};