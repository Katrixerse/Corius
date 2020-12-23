const { richEmbed } = require('discord.js');

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
    const roles = message.guild.roles.filter(r => teams.some(t => t.name == r.name));
    if (roles.size == 0) return funcs.send(`No teams found in this guild.`);
    const embed = new richEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor(funcs.rc())
        .setFooter(bot.user.username)
        .setDescription(`Join a team by entering the number before it's name. Say exit to cancel.`)
        .setThumbnail(message.author.avatarURL);
    let n = 0;
    roles.forEach(role => {
        embed.addField(`${n += 1}#:`, role.name);
    });
    message.channel.send(embed).then(() => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            errors: ["time"],
            time: 30000
        }).then((response) => {
            response = response.array()[0].content;
            if (response == "exit") return funcs.send(`Command canceled.`);
            const num = parseInt(response);
            if (isNaN(num) || num <= 0 || num > roles.size) return funcs.send(`Not a valid number.`);
            embed.fields.forEach(field => {
                if (field.name.startsWith(num)) {
                    const roleToAdd = message.guild.roles.find(r => r.name == field.value);
                    if (!roleToAdd) return funcs.send(`Team not found. It might have been deleted.`);
                    if (message.member.highestRole.position >= message.guild.me.highestRole.position || roleToAdd.position >= message.guild.me.highestRole.position) return funcs.send(`You or the role have the same position or a higher position than me.`);
                    message.member.addRole(roleToAdd).catch((e) => funcs.send(`Error: ${e.message}`));
                    funcs.send(`Joined ${roleToAdd.name}!`);
                }
            });
        }).catch((e) => {
            funcs.send(`You ran out of time or an error occured!`);
            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
        });
    });
};

module.exports.config = {
    name: "jointeam",
    aliases: [],
    usage: "Use this command to join a team if there are any.",
    commandCategory: "fun",
    cooldownTime: "0"
};
