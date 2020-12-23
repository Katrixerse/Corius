const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
module.exports.run = (bot, message, args, funcs) => {
    try {
            let whatto = args.join(` `);
            if (!whatto) return send(`Please provide a math equation to solve.`);
                let result = math.evaluate(whatto).toString();
                const embed = new MessageEmbed()
                    .setTitle("Math Result")
                    .setColor(funcs.rc())
                    .setThumbnail(bot.user.avatarURL)
                    .setTimestamp()
                    .addField(`Equation:`, `\`\`\`js\n${whatto}\`\`\``, true)
                    .addField(`Result:`, `\`\`\`js\n${result}\`\`\``, true);
                message.delete();
                message.channel.send(embed).catch(() => funcs.send('Invalid expression.'));
    } catch (e) {
        return funcs.send('Invalid expression.')
    }
};

module.exports.config = {
    name: "math",
    aliases: [],
    usage: "Help answer your math question",
    commandCategory: "fun",
    cooldownTime: '5'
  };