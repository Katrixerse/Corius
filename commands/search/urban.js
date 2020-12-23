const { richEmbed } = require('discord.js');
const request = require('node-superfetch');
const types = ['top'];
module.exports.run = async (bot, message, args, funcs) => {
    if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
    const word = args.join(" ");
    try {
        const { body } = await request
          .get('http://api.urbandictionary.com/v0/define')
          .query({
            term: word
          });
        if (!body.list.length) return send('Could not find any results.');
        const data = body.list[types === 'top' ? 0 : Math.floor(Math.random() * body.list.length)];
        const embed = new richEmbed()
          .setColor(funcs.rc())
          .setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
          .setURL(data.permalink)
          .setTitle(data.word)
          .setDescription(data.definition.length > 2048 ? data.definition.substr(0, 2000) : data.definition)
          .addField('Example', data.example);
        message.channel.send(embed);
      } catch (err) {
        if (err.status === 404) return msg.say('Could not find any results.');
        console.log(err);
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
  name: "urban",
  aliases: [],
  usage: "Search urban dictionary.",
  commandCategory: "search",
  cooldownTime: "0"
};
