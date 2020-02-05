module.exports.run = (bot, message, args, funcs) => {
    if (message.author.id !== "130515926117253122") return message.channel.send("Only bot owner can use this command.");
    process.exit(1);
};

module.exports.config = {
  name: "reboot",
  aliases: [""],
  usage: "Hard reboots the bot [NEEDS TO USE PM2].",
  commandCategory: "owner",
  cooldownTime: '0'
};
