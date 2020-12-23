const { richEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
    try {
        const query = args.join(" ");
        if (query < 1) return send("You didn't provide something to search for.");
        const fetch = request
          .get('https://api.nytimes.com/svc/search/v2/articlesearch.json')
          .query({
            'api-key': "nytimes api key",
            sort: 'newest'
          });
        if (query) fetch.query({
          q: query
        });
        const {
          body
        } = await fetch;
        if (!body.response.docs.length) return send('Could not find any results');
        const data = body.response.docs[Math.floor(Math.random() * body.response.docs.length)];
        const embed = new richEmbed()
          .setColor(funcs.rc())
          .setAuthor('New York Times', 'https://i.imgur.com/ZbuTWwO.png', 'https://www.nytimes.com/')
          .addField('Publish Date', new Date(data.pub_date).toDateString(), true)
          .setURL(data.web_url)
          .setTitle(data.headline.main)
          .setDescription(data.snippet);
        return message.channel.send(embed);
      } catch (err) {
        if (err.status === 404) return msg.say('Could not find any results.');
        console.log(err);
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
  name: "nytimes",
  aliases: [],
  usage: "Search nytimes for news.",
  commandCategory: "search",
  cooldownTime: "0"
};
