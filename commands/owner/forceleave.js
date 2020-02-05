module.exports.run = (bot, message, args, funcs) => {
    if (message.author.id !== "130515926117253122" && message.author.id !== "307472480627326987") return message.channel.send("Only bot owner can use this command.");
    const guildToLeave = args.join('')
    const checkGuild = bot.guilds.get(guildToLeave);
    if (!checkGuild) return message.channel.send(`Im not in the guild with the ID: ${guildToLeave}`)
    try {
        if (message.guild.id === guildToLeave) return ('Please only use this command to force leave other guilds.')
        checkGuild.leave();
        funcs.send(`I have left the guild with ID: ${guildToLeave}`)
    } catch (err) {
        console.log(err.stack)
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
  name: "forceleave",
  aliases: [""],
  usage: "Forces the bot to leave a guild.",
  commandCategory: "owner",
  cooldownTime: '0'
};
