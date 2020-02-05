module.exports.run = async (bot, message, args, send) => {
    try {
        message.channel.send(`¯\_(ツ)_/¯`);
        if (!message.guild.me.hasPermission(permissionNeeded)) {
            message.delete();
        }
        return;
    } catch (e) {
        console.error;
        send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "disabledshrug",
    aliases: ["dshrug"],
    usage: "Use this command to shrug, weirder.",
    commandCategory: "fun",
    cooldownTime: '5'
};