const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    try {
      const {
        body
      } = await request
        .get("https://www.reddit.com/r/comics.json?sort=top&t=week")
        .query({
          limit: 800
        });
      const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
      if (!allowed.length) return funcs.send(`Can't find any other images right now, try again later.`);
      const randomnumber = Math.floor(Math.random() * allowed.length);
      const embed = new MessageEmbed()
        .setColor(funcs.rc())
        .setTitle(allowed[randomnumber].data.title)
        .setDescription("Posted by: " + allowed[randomnumber].data.author)
        .setImage(allowed[randomnumber].data.url)
        .setFooter("Image provided by r/comics");
      message.channel.send(embed);
    } catch (e) {
      return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
  } catch (e) {
    console.error;
    funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
  }
};

module.exports.config = {
  name: "comics",
  aliases: [""],
  usage: "Use this command to get an image from r/comics.",
  commandCategory: "reddit",
  cooldownTime: "5"
};