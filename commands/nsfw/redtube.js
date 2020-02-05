const { RichEmbed } = require("discord.js");
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  if (!message.channel.nsfw) return funcs.send(`Can't send NSFW content in a SFW channel.`);
  let thing = args.join(` `);
  if (!thing) return funcs.send(`Please enter something to search on redtube!`);
  try {
    const {
      body
    } = await request
      .get(`https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&search=${thing}&thumbsize=medium`);
    if (body.count == 0) return funcs.send(`No results found.`);
    let embed = new RichEmbed()
      .setTitle(`Redtube`)
      .addField(`Searched for:`, thing)
      .addField(`Found:`, body.videos[0].video.title)
      .addField(`Duration:`, body.videos[0].video.duration)
      .addField(`Views:`, body.videos[0].video.views)
      .addField(`URL:`, body.videos[0].video.url)
      .setColor(funcs.rc())
      .setThumbnail(body.videos[0].video.thumb);
    message.channel.send(embed);
  } catch (err) {
    console.log(err);
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "redtube",
  aliases: [],
  usage: "Use this command to redtube something.",
  commandCategory: "nsfw",
  cooldownTime: '5'
};