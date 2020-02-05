const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        let user = message.mentions.members.first();
        if (!user) return funcs.send(`Please mention somebody to get information about them.`);
        const member = await message.channel.guild.members.get(user.id);

        const roles = member.roles
            .filter(role => role.id !== message.guild.defaultRole.id)
            .sort((a, b) => b.position - a.position)
            .map(role => role.name);

            const activities = {
                PLAYING: 'Playing',
                STREAMING: 'Streaming',
                WATCHING: 'Watching',
                LISTENING: 'Listening to'
            };

        let embed = new RichEmbed()
            .setColor(funcs.rc())
            .setTitle('User info')
            .addField('**__Basic Info:__**', `Username: ${user.user.tag}\nUser Nickname: ${member.displayName}\nUser ID: ${user.id}`)
            .addField('**__Activites:__**',  `Status: ${member.presence !== null && member.presence.status !== null ? member.presence.status : "Offline"}\nPlaying: ${member.presence.game !== null ? member.presence.game.name : `None`}`)
            .addField('**__Role(s) Info:__**', `Roles: ${roles.length ? funcs.trimArray(roles, 10).join(', ') : 'None'}\nHoist Role: ${member.roles.hoist ? member.roles.hoist.name : 'None'}\nHighest Role: ${member.highestRole.name}`)
            .addField('**__Dates:__**', `Guild join date: ${user.joinedAt.toDateString()}\nDiscord join date: ${user.user.createdAt.toDateString()}`)
        message.channel.send(embed);
    } catch (err) {
        console.log(err);
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
    name: "whois",
    aliases: [],
    usage: "Use this command to get a user's information.",
    commandCategory: "info",
    cooldownTime: '0'
};