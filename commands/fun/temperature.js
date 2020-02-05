module.exports.run = (bot, message, args, funcs) => {
    message.channel.send(`__**What would you like to do?**__\n\`\`\`Convert from Celsius to Fahrenheit (say 1)\nConvert from Celsius to Kelvin (say 2)\nConvert from Fahrenheit to Celsius (say 3)\nConvert from Kelvin to Celsius say (4)\`\`\``).then(() => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            errors: ["time"],
            time: 30000
        }).then((response) => {
            response = response.array()[0].content;
            if (response == "1") {
                message.channel.send(`__**Enter temperature in Celsius...**__`).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = parseInt(response.array()[0].content);
                        if (isNaN(response)) return funcs.send(`Not a valid number!`);
                        const newtemp = 9 / 5 * response + 32;
                        funcs.send(`${response}°C is ${newtemp.toFixed(2)}°F`);
                    }).catch((e) => {
                        funcs.send(`You ran out of time or an error occured!`);
                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                    });
                });
            } else if (response == "2") {
                message.channel.send(`__**Enter temperature in Celsius...**__`).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = parseInt(response.array()[0].content);
                        if (isNaN(response)) return funcs.send(`Not a valid number!`);
                        const newtemp = response + 274.15;
                        funcs.send(`${response}°C is ${newtemp.toFixed(2)}K`);
                    }).catch((e) => {
                        funcs.send(`You ran out of time or an error occured!`);
                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                    });
                });
            } else if (response == "3") {
                message.channel.send(`__**Enter temperature in Fahrenheit...**__`).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = parseInt(response.array()[0].content);
                        if (isNaN(response)) return funcs.send(`Not a valid number!`);
                        const newtemp = response - 17.77778;
                        funcs.send(`${response}°F is ${newtemp.toFixed(2)}°C`);
                    }).catch((e) => {
                        funcs.send(`You ran out of time or an error occured!`);
                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                    });
                });
            } else if (response == "4") {
                message.channel.send(`__**Enter temperature in Kelvin...**__`).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        response = parseInt(response.array()[0].content);
                        if (isNaN(response)) return funcs.send(`Not a valid number!`);
                        const newtemp = response - 272.15;
                        funcs.send(`${response}K is ${newtemp.toFixed(2)}°C`);
                    }).catch((e) => {
                        funcs.send(`You ran out of time or an error occured!`);
                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                    });
                });
            }
        }).catch((e) => {
            funcs.send(`You ran out of time or an error occured!`);
            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
        });
    });
};

module.exports.config = {
    name: "temperature",
    aliases: [],
    usage: "Convert temperature.",
    commandCategory: "fun",
    cooldownTime: "3"
};
