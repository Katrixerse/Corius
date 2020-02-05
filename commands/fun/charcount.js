const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        let what = args.join(` `);
        if (!what) return funcs.send(`You did not enter anything to display the character count of.`);
        let e = new RichEmbed()
            .setColor(funcs.rc())
            .addField(`Text:`, what)
            .addField(`Count:`, `${what.length} character(s).`)
            .setTimestamp()
            .setThumbnail(bot.user.avatarURL);
        message.channel.send(e);
    } catch (err) {
        console.log(err) 
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
      }
};

module.exports.config = {
    name: "charcount",
    aliases: [],
    usage: "Use this command to get the character count of something.",
    commandCategory: "fun",
    cooldownTime: '5'
};