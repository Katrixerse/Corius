module.exports.run = (bot, message, args, funcs) => {
    message.channel.send(`__**What year have you been born in?**__`).then(() => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            errors: ["time"],
            time: 30000
        }).then((response) => {
            response = parseInt(response.array()[0].content);
            if (isNaN(response)) return funcs.send(`Not a valid birth year!`, true);
            if (response >= new Date().getFullYear()) return funcs.send(`Not a valid birth year!`, true);
            funcs.send(`A person that has been born in ${response} would be ${new Date().getFullYear() - response} years old in ${new Date().getFullYear()}.`);
        }).catch((e) => {
            funcs.send(`You ran out of time or an error occured!`);
            console.log(`Error: ${e.message} in guild ${message.guild.name} command age`);
        });
    });
};

module.exports.config = {
    name: "age",
    aliases: [],
    usage: "Use this command to calculate your age.",
    commandCategory: "fun",
    cooldownTime: '5'
};