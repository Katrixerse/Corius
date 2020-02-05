
module.exports.run = (bot, message, args, funcs) => {
    let turn = message.author;
    var interval;
    var nextTurn = async function () {
        interval = await setInterval(() => {
            if (turn.id == message.author.id) {
                funcs.send(`${message.author.username} it is your turn`);
                message.channel.send(`__**say something you bum**__`).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        turn = bot;
                        clearInterval(interval);
                        nextTurn();
                    }).catch((e) => {
                        funcs.send(`You ran out of time or an error occured!`);
                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                    });
                });
            } else if (turn.id == bot.id) {
                funcs.send(`It is my turn`);
                message.channel.send(`__**i sadly cant say anythig but if i could the command would go on**__`).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        errors: ["time"],
                        time: 30000
                    }).then((response) => {
                        turn = message.author;
                        clearInterval(interval);
                        nextTurn();
                    }).catch((e) => {
                        funcs.send(`You ran out of time or an error occured!`);
                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                    });
                });
            };
            clearInterval(interval);
        }, require('ms')('1s'));
    };
    nextTurn();
};

module.exports.config = {
    name: 'turnstest',
    usage: "",
    cooldownTime: '0',
    commandCategory: 'rpg',
    aliases: []
}