const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, funcs) => {
    const teams = [{
        name: "#blossom",
        color: "#ff6b87"
    }, {
        name: "#fire",
        color: `#ff6d2e`
    }, {
        name: "#ice",
        color: "#2ea1ff"
    }, {
        name: "#wind",
        color: "#ffffe6"
    }, {
        name: "#spring",
        color: "#b0ff9e"
    }, {
        name: "#summer",
        color: "#efc2f1"
    }, {
        name: "#fall",
        color: "#ff8a24"
    }, {
        name: "#winter",
        color: "#b5fffb"
    }, {
        name: "#earth",
        color: "#f0a884"
    }];
    const roles = message.member.roles.filter(r => teams.some(t => t.name == r.name));
    if (roles.size == 0) return funcs.send(`You have not joined any teams yet.`);
    roles.forEach(role => {
        const roleToAdd = message.guild.roles.find(r => r.name == role.name);
        if (!roleToAdd) return;
        if (message.member.highestRole.position >= message.guild.me.highestRole.position || roleToAdd.position >= message.guild.me.highestRole.position) return;
        message.member.removeRole(roleToAdd);
    });
    funcs.send(`All teams that were on you were deleted. (if they had a lower position than me.)`)
};

module.exports.config = {
    name: "leaveteam",
    aliases: [],
    usage: "Use this command to leave a team if joined any.",
    commandCategory: "fun",
    cooldownTime: "0"
};
