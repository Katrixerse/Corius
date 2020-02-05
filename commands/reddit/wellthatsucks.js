const { RichEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        const {
            body
        } = await request
            .get("https://www.reddit.com/r/Wellthatsucks.json?sort=top&t=week")
            .query({
                limit: 800
            });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return funcs.send(`Can't find any other images right now, try again later.`);
        const randomnumber = Math.floor(Math.random() * allowed.length);
        const embed = new RichEmbed()
            .setColor(funcs.rc())
            .setTitle(allowed[randomnumber].data.title)
            .setDescription("Posted by: " + allowed[randomnumber].data.author)
            .setImage(allowed[randomnumber].data.url)
            .setFooter("Image provided by r/WellThatSucks");
        message.channel.send(embed);
    } catch (err) {
        console.log(err)
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
    name: "wellthatsucks",
    aliases: [],
    usage: "Use this command to get an image that sucks from r/WellThatSucks.",
    commandCategory: "reddit",
    cooldownTime: '5'
};