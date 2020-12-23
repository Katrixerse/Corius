const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const moment = require('moment');
const { GITHUB_USER, GITHUB_PASS } = require('../../assets/config.json');
module.exports.run = async (bot, message, args, funcs) => {
  if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
  const author = args[0]
  const repository = args.slice(1).join(" ")
  try {
    const {
      body
    } = await request
      .get(`https://api.github.com/repos/${author}/${repository}`)
      .set({
        Authorization: `Basic ${`${GITHUB_USER}:${GITHUB_PASS}`}`
      });
    const descriptionfix = body.description.substr(0, 300);
    const embed = new MessageEmbed()
      .setColor(funcs.rc())
      .setAuthor('GitHub', 'https://i.imgur.com/e4HunUm.png', 'https://github.com/')
      .setTitle(body.full_name)
      .setURL(body.html_url)
      .setDescription(body.description ? (descriptionfix) : 'No description.')
      .setThumbnail(body.owner.avatar_url)
      .addField('Stars', body.stargazers_count, true)
      .addField('Forks', body.forks, true)
      .addField('Issues', body.open_issues, true)
      .addField('Language', body.language || 'Unknown', true)
      .addField('Creation Date', moment.utc(body.created_at).format('MM/DD/YYYY h:mm A'), true)
      .addField('Modification Date', moment.utc(body.updated_at).format('MM/DD/YYYY h:mm A'), true);
    message.channel.send(embed)
  } catch (err) {
    if (err.status === 404) return msg.say('Could not find any results.');
    console.log(err);
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "github",
  aliases: [],
  usage: "Search on github for a project.",
  commandCategory: "search",
  cooldownTime: "0"
};