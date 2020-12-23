const { richEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
 if (!message.channel.nsfw) return message.channel.send("Cannot send NSFW content in a SFW channel.");
    try {
        const { body } = await request
            .get('https://www.reddit.com/r/adultgifs.json?sort=top&t=week')
            .query({
                limit: 800
            });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
        const randomnumber = Math.floor(Math.random() * allowed.length)
        let image = allowed[randomnumber].data.url
        let imagefix = image.replace(".gifv", ".gif")
        const embed = new richEmbed()
            .setColor(funcs.rc())
            .setTitle(allowed[randomnumber].data.title)
            .setDescription("Posted by: " + allowed[randomnumber].data.author)
            .setImage(imagefix)
        return message.channel.send(embed);
    } catch (err) {
        console.log(err);
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
  name: "porngif",
  aliases: [],
  usage: "Use this command to search for a porn GIF.",
  commandCategory: "nsfw",
  cooldownTime: '5'
};