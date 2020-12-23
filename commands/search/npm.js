const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const req = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  const pkg = args.join(' ');
  if (!pkg) return funcs.send('Provided no input.');
  try {
    const {
      body
    } = await req.get(`https://registry.npmjs.com/${pkg}`);
    if (body.time.unpublished) return funcs.send('This package no longer exists.');
    const version = body.versions[body['dist-tags'].latest];
    const maintainers = body.maintainers.map(user => user.name);
    const dependencies = version.dependencies ? Object.keys(version.dependencies) : null;
    const embed = new MessageEmbed()
      .setColor(funcs.rc())
      .setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
      .setTitle(body.name)
      .setURL(`https://www.npmjs.com/package/${pkg}`)
      .setDescription(body.description || 'No description.')
      .addField('Version', body['dist-tags'].latest, true)
      .addField('License', body.license || 'None', true)
      .addField('Author', body.author ? body.author.name : '???', true)
      .addField('Creation Date', moment.utc(body.time.created).format('MM/DD/YYYY h:mm A'), true)
      .addField('Modification Date', moment.utc(body.time.modified).format('MM/DD/YYYY h:mm A'), true)
      .addField('Main File', version.main || 'index.js', true)
      .addField('Dependencies', dependencies && dependencies.length ? dependencies.join(', ') : 'None')
      .addField('Maintainers', maintainers.join(', '));
    return message.channel.send(embed);
  } catch (err) {
    if (err.status === 404) return msg.say('Could not find any results.');
    console.log(err);
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
}
};

module.exports.config = {
  name: "npm",
  aliases: [''],
  usage: "Search for an npm package",
  commandCategory: "search",
  cooldownTime: "0"
};