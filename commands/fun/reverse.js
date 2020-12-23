const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
            let purgeusage = new MessageEmbed()
                .setTitle(`${row.prefix}reverse`)
                .setAuthor("Reverse command usage.")
                .setFooter(message.createdAt.toDateString(), bot.user.avatarURL)
                .setColor(funcs.rc())
                .setDescription(`${row.prefix}reverse <text>.`)
                .addField("Reversing a text:", `${row.prefix}reverse hello`, true)
                .addField("Reversing hello will return:", "olleh", true);
            let raw = message.content.substring(row.prefix.length + `reverse`.length, 1980);
            if (!raw) return message.channel.send(purgeusage);
            let rev = raw.split("").reverse().join(``);
            if (!rev) return message.channel.send(purgeusage);
            let em = new MessageEmbed()
                .setTitle(`Reverse`)
                .addField(`Input`, `\`\`\`\n${args.join(` `)}\`\`\``)
                .addField(`Output`, `\`\`\`\n${rev}\`\`\``)
                .setColor(funcs.rc())
                .setTimestamp()
                .setFooter(message.author.username);
            message.channel.send(em);
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "reverse",
    aliases: [],
    usage: "reverse text.",
    commandCategory: "fun",
    cooldownTime: '5'
  };