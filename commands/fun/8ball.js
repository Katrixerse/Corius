const { RichEmbed } = require('discord.js');
module.exports.run = (bot, message, args, funcs) => {
    const question = args.join(` `);
    if (!question) return funcs.send(`You did not provide a question!`, true);
    const responses = [
        `● It is certain.`,
        `● It is decidedly so.`,
        `● Without a doubt.`,
        `● Yes - definitely.`,
        `● You may rely on it.`,
        `● As I see it, yes.`,
        `● Most likely.`,
        `● Outlook good.`,
        `● Yes.`,
        `● Signs point to yes.`,
        `● Reply hazy, try again.`,
        `● Ask again later.`,
        `● Better not tell you now.`,
        `● Cannot predict now.`,
        `● Concentrate and ask again.`,
        `● Don't count on it.`,
        `● My reply is no.`,
        `● My sources say no.`,
        `● Outlook not so good.`,
        `● Very doubtful.`
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    const embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor(funcs.rc())
        .setFooter(bot.user.username)
        .setTitle(`Magic 8ball`)
        .addField(`Question:`, question.endsWith("?") ? question : question + "?", true)
        .addField(`Answer:`, response, true)
        .setThumbnail(message.author.avatarURL);
    message.channel.send(embed);
};

module.exports.config = {
    name: "8ball",
    aliases: [],
    usage: "Use this command to access the magic 8ball.",
    commandCategory: "fun",
    cooldownTime: '5'
};