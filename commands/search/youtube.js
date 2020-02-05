const { RichEmbed } = require('discord.js');
const request = require("node-superfetch");
module.exports.run = async (bot, message, args, funcs) => {
   if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
    try {
        const query = args.join(` `);
        const { body } = await request
          .get('https://www.googleapis.com/youtube/v3/search')
          .query({
            part: 'snippet',
            type: 'video',
            maxResults: 1,
            q: query,
            key: "Google api key"
          });// hello zach kun
        if (!body.items.length) return funcs.send('No results found for ' + query + ".");
        const embed = new RichEmbed()
          .setColor(funcs.rc())
          .setTitle(body.items[0].snippet.title)
          .setDescription(body.items[0].snippet.description)
          .setAuthor(`Searched - ${body.items[0].snippet.channelTitle}`)
          .setURL(`https://www.youtube.com/watch?v=${body.items[0].id.videoId}`)
          .setThumbnail(body.items[0].snippet.thumbnails.default.url);
        message.channel.send(embed).catch(console.error);
      } catch (err) {
        if (err.status === 404) return msg.say('Could not find any results.');
        console.log(err);
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
  name: "youtube",
  aliases: [],
  usage: "Search youtube.",
  commandCategory: "search",
  cooldownTime: '5'
};
