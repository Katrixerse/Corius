const { richEmbed } = require('discord.js');
const request = require('request');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    if (!message.channel.nsfw) return funcs.send(`This command can only be used in NSFW channels.`);
    const sub = args.join(` `);
    const subFix = sub.replace(/r\//g, '')
    if (subFix.length === 0 || !sub) return funcs.send(`You did not specify a sub to search for!`);
    const link = `https://reddit.com/r/${subFix}/about.json`;
    request(link, {
      method: "GET"
    }, (e, res, body) => {
      let bod = JSON.parse(body);
      bod = bod.data;
      if (!bod) return funcs.send(`No subs found!`);
      const thumbnail = bod.icon_img;
      const embed = new richEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor(funcs.rc())
        .setFooter(bot.user.username)
        .setTitle(bod.display_name_prefixed)
        .addField(`Subscribers:`, bod.subscribers)
        .addField(`Subscribers active:`, bod.accounts_active)
        .setDescription(bod.public_description)
        .setThumbnail(thumbnail);
      message.channel.send(embed);
    });
  } catch (e) {
    console.log(e);
    funcs.send(`Oh no, an error occurred!\n${e.message}`);
  }
};

module.exports.config = {
  name: "reddit",
  aliases: [],
  usage: "Use this command to reddit something or get a random sub.",
  cooldownTime: '5',
  commandCategory: "reddit"
};