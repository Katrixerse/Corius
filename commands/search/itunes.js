const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    const query = args.join('');
    const {
      body
    } = await request
      .get('https://itunes.apple.com/search')
      .query({
        term: query,
        media: 'music',
        entity: 'song',
        limit: 1,
        explicit: message.channel.nsfw ? 'yes' : 'no'
      });
    const body2 = JSON.parse(body.toString());
    if (!body2.results.length) return funcs.send('Could not find any results.');
    const data = body2.results[0];
    const embed = new RichEmbed()
      .setColor(funcs.rc())
      .setAuthor('iTunes', 'https://i.imgur.com/PR29ow0.jpg', 'https://www.apple.com/itunes/')
      .setURL(data.trackViewUrl)
      .setThumbnail(data.artworkUrl100)
      .setTitle(data.trackName)
      .addField('Artist', data.artistName, true)
      .addField('Album', data.collectionName, true)
      .addField('Release Date', new Date(data.releaseDate).toDateString(), true)
      .addField('Genre', data.primaryGenreName, true);
    return message.channel.send(embed);
  } catch (err) {
    if (err.status === 404) return msg.say('Could not find any results.');
    console.log(err);
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
}
};

module.exports.config = {
  name: "itunes",
  aliases: [''],
  usage: "Search itunes for a song",
  commandCategory: "search",
  cooldownTime: "5"
};