const { richEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    const query = args.join(" ");
    const {
      body
    } = await request
      .get('https://developer.mozilla.org/en-US/search.json')
      .query({
        q: query,
        locale: 'en-US',
        highlight: false
      });
    if (!body.documents.length) return funcs.send('Could not find any results.');
    const data = body.documents[0];
    const embed = new richEmbed()
      .setColor(funcs.rc())
      .setAuthor('Mozilla Developer Network', 'https://i.imgur.com/DFGXabG.png', 'https://developer.mozilla.org/')
      .setURL(data.url)
      .setTitle(data.title)
      .setDescription(data.excerpt);
    return message.channel.send(embed);
  } catch (err) {
    if (err.status === 404) return msg.say('Could not find any results.');
    console.log(err);
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
}
};

module.exports.config = {
  name: "mdn",
  aliases: [''],
  usage: "Search mdn.",
  commandCategory: "search",
  cooldownTime: "5"
};