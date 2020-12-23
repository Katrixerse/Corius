const { MessageEmbed } = require('discord.js');
const req = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        const {
            body
        } = await req
            .get("https://catfact.ninja/fact");
        const embed = new MessageEmbed()
            .setTitle(`Cat Fact`)
            .setDescription(`${body.fact}`)
            .setColor(funcs.rc());
        message.channel.send(embed);
    } catch (err) {
        console.log(err) 
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
      }
};

module.exports.config = {
    name: "catfact",
    aliases: [],
    usage: "Use this command to get a random cat fact.",
    commandCategory: "fun",
    cooldownTime: '5'
};