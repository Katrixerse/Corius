const { richEmbed} = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
  try {
    const {
      body
    } = await request
      .get("https://www.reddit.com/r/Nude_Selfie.json?sort=top&t=week")
      .query({
        limit: 800
      });
    //const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    //if (!allowed.length) return send(`Can't find any other images right now, try again later.`);
    const allowed = body.data.children;
    const randomnumber = Math.floor(Math.random() * allowed.length);
    const embed = new richEmbed()
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
  name: "nude",
  aliases: [],
  usage: "Use this command to an image with a hot mom.",
  commandCategory: "nsfw",
  cooldownTime: '5'
};