const fs = require('fs');
module.exports.run = (bot, message, args, funcs) => {
    try {
        const groupName = args[0];
        let commandName = args[1];
        if (!groupName) return message.channel.send('***You need to provide a command category, stupid not having very nice ass and in the same time being an idiot.***');
        if (!bot.commands.has(commandName) && !bot.aliases.has(commandName)) {
            return message.channel.send("***That command does not exist.***");
        } else if (!bot.commands.has(commandName) && bot.aliases.has(commandName)) {
            commandName = bot.commands.get(bot.aliases.get(commandName)).config.name;
        }
        delete require.cache[require.resolve(`../${groupName}/${commandName}.js`)];
        bot.commands.delete(commandName);
        const props = require(`../${groupName}/${commandName}.js`);
        bot.commands.set(commandName, props);
        message.channel.send(`***The command ${commandName} has been reloaded.***`);
    } catch (e) {
        console.log(e.message);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "reload",
    aliases: ["rd"],
    usage: "Reloads the bot.",
    commandCategory: "owner",
    cooldownTime: '0'
};