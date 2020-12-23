const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    const {
      body
    } = await request
      .get("https://www.reddit.com/r/penis.json?sort=top&t=week")
      .query({
        limit: 800
      });
    if (!message.channel.nsfw) return funcs.send(`Cannot send nsfw in a sfw channel.`);
    const allowed = body.data.children;
    if (!allowed.length) return funcs.send(`Can't find any other images right now, try again later.`);
    const randomnumber = Math.floor(Math.random() * allowed.length);
    const embed = new MessageEmbed()
      .setColor(funcs.rc())
      .setTitle(allowed[randomnumber].data.title)
      .setDescription("Posted by: " + allowed[randomnumber].data.author)
      .setImage(allowed[randomnumber].data.url)
    message.channel.send(embed);
  } catch (err) {
    console.log(err);
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "dick",
  aliases: [],
  usage: "Use this command to get an image with a dick from r/penis.",
  commandCategory: "nsfw",
  cooldownTime: '5'
};