const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        message.channel.send(`**__Enter the first object to choose from or type exit to cancel__**`)
            .then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                })
                    .then((obj1) => {
                        if (!obj1) return;
                        obj1 = obj1.array()[0];
                        if (obj1 == "exit") return funcs.send(`Command canceled!`);
                        message.channel.send(`__**Now enter the second object.**__`)
                            .then(() => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    time: 30000,
                                    errors: ['time'],
                                })
                                    .then((obj2) => {
                                        if (!obj2) return;
                                        obj2 = obj2.array()[0];
                                        if (obj2.content == obj1.content) return funcs.send(`Can't choose between the same thing.`);
                                        var thing = [obj1.content, obj2.content];
                                        let picked = thing[Math.floor(Math.random() * thing.length)];
                                        let embed = new RichEmbed()
                                            .setTimestamp()
                                            .setColor(funcs.rc())
                                            .setDescription(`**__Picked object:__** ${picked}`)
                                            .setThumbnail(bot.user.avatarURL);
                                        message.channel.send(embed);
                                    })
                                    .catch((e) => {
                                        console.log(e);
                                        funcs.send(`Time has expired.`);
                                    });
                            });
                    })
                    .catch((e) => {
                        console.log(e);
                        funcs.send(`Time has expired.`);
                    });
            });
        } catch (err) {
            console.log(err) 
            return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
          }
};

module.exports.config = {
    name: "choose",
    aliases: [],
    usage: "Use this command to choose from two objects.",
    commandCategory: "fun",
    cooldownTime: '5'
};