const { RichEmbed } = require('discord.js');
const filterLevels = ['Off', 'No Role', 'Everyone'];
const verificationLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'];
module.exports.run = async (bot, message, args, funcs) => {
    try {
        const guild = message.guild;
        const embed = new RichEmbed()
            .setColor(funcs.rc())
            .setTitle('Guild Info')
            .addField('**__Info:__**', `Owner: ${guild.owner.username}\nGuild ID: ${guild.id}\nRegion: ${guild.region}\nServer Created On: ${guild.createdAt.toDateString()}`)
            .addField('**__Stats:__**', `Members: ${guild.memberCount}\nChannels: ${guild.channels.size}\nEmojis: ${guild.emojis.size}\nRoles: ${guild.roles.size}`)
            .addField('**__Misc:__**', `Verification Level: ${verificationLevels[guild.verificationLevel]}\nExplicit FIlter: ${filterLevels[guild.explicitContentFilter]}`)
        message.channel.send(embed);
    } catch (e) {
        console.log(e);
        send(`Oh no, an error occurred!\n${e.message}`);
    }
};

module.exports.config = {
    name: "guildinfo",
    aliases: ["gi"],
    usage: "Use this command to get the guild's information.",
    commandCategory: "info",
    cooldownTime: "5"
};