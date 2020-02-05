const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
  try {
    const query = args.join(' ');
    const { body } = await request
      .get('https://en.wikipedia.org/w/api.php')
      .query({
        action: 'query',
        prop: 'extracts',
        format: 'json',
        titles: query,
        exintro: '',
        explaintext: '',
        redirects: '',
        formatversion: 2
      });
    if (body.query.pages[0].missing) return funcs.send('No Results found.');
    const embed = new RichEmbed()
      .setColor(funcs.rc())
      .setTitle(body.query.pages[0].title)
      .setAuthor('Wikipedia', 'https://i.imgur.com/a4eeEhh.png')
      .setDescription(body.query.pages[0].extract.substr(0, 2000).replace(/[\n]/g, '\n\n'));
    return message.channel.send(embed);
  } catch (err) {
    if (err.status === 404) return msg.say('Could not find any results.');
    console.log(err);
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
}
};

module.exports.config = {
  name: "wikipedia",
  aliases: ['wiki'],
  usage: "Searchs wikipedia for your query.",
  commandCategory: "search",
  cooldownTime: "0"
};
