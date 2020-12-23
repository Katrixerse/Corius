const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    const {
      body
    } = await request
      .get("https://www.reddit.com/r/gonewild.json")
      .query({
        limit: 800
      });
    //const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
    //if (!allowed.length) return send(`Can't find any other images right now, try again later.`);
    const allowed = body.data.children;
    if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
    const randomnumber = Math.floor(Math.random() * allowed.length);
    const embed = new MessageEmbed()
      .setColor(funcs.rc())
      .setTitle(allowed[randomnumber].data.title)
      .setDescription("Posted by: " + allowed[randomnumber].data.author)
      .setImage(allowed[randomnumber].data.url)
      .setFooter("Image provided by r/gonewild");
    message.channel.send(embed);
  } catch (err) {
    console.log(err);
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "moreporn",
  aliases: [],
  usage: "Use this command to get even more porn.",
  commandCategory: "nsfw",
  cooldownTime: '5'
};