const { richEmbed } = require("discord.js");
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        const { body } = await request
            .get("https://www.reddit.com/r/cats.json?sort=top&t=week")
            .query({
                limit: 800
            });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return send(`Can't find any other images right now, try again later.`);
        const randomnumber = Math.floor(Math.random() * allowed.length);
        const embed = new richEmbed()
            .setColor(funcs.rc())
            .setTitle(allowed[randomnumber].data.title)
            .setDescription("Posted by: " + allowed[randomnumber].data.author)
            .setImage(allowed[randomnumber].data.url)
            .setFooter("Image provided by r/cats");
        message.channel.send(embed);
    } catch (err) {
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
    name: "cat",
    aliases: [""],
    usage: "Sends random pictures of cats.",
    commandCategory: "fun",
    cooldownTime: "5"
};
