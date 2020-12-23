const { MessageEmbed} = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
  try {
    const {
      body
    } = await request
      .get("https://www.reddit.com/r/brunette.json?sort=top&t=week")
      .query({
        limit: 800
      });
    const allowed = body.data.children;
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
  name: "brunette",
  aliases: [],
  usage: "Use this command to an image off of r/brunette.",
  commandCategory: "nsfw",
  cooldownTime: '5'
};