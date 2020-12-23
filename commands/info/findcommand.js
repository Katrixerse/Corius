const { richEmbed } = require('discord.js');
module.exports.run = (bot, message, args, funcs) => {
  try {
    let command = args.join(` `);
    if (!command) return funcs.send(`Please enter a command to search for!`);
    let cmds = bot.commands;
    let results = cmds.filter(cmd => cmd.config.name.toLowerCase().includes(command.toLowerCase()));
    if (results.size === 0) return funcs.send(`Could not find any results!`);
    const embed = new richEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setColor(funcs.rc())
      .setFooter(bot.user.username)
      .setTitle(`Results:`)
      .setDescription('Choose a command by entering the number before it.')
      .setThumbnail(message.author.avatarURL);
    let n = 0;
    results.forEach(result => {
      if (n > 9) return;
      embed.addField(`${n += 1}#:`, `Command: ${result.config.name}\nUsage: ${result.config.usage}`);
    });
    n = 0;
    message.channel.send(embed).then(() => {
      message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        errors: ["time"],
        time: 30000
      }).then((response) => {
        response = parseInt(response.array()[0].content);
        if (isNaN(response) || response > results.size || response <= 0) return funcs.send(`Not a valid number.`);
        embed.fields.forEach(field => {
          if (field.name == `${response}#:`) {
            const commandname = field.value.split("\n")[0].substr(9);
            const result = results.filter(r => r.config.name == commandname);
            const embed = new richEmbed()
              .setTitle("Results")
              .setColor(funcs.rc())
              .setTimestamp()
              .addField(`Searched for:`, command)
              .addField(`Found:`, result.first().config.name)
              .addField(`Usage:`, result.first().config.usage)
              .setFooter(`Note that this will only show you the top 10 matches.`)
              .addField(`Alias:`, result.first().config.aliases.length == 0 ? "No aliases" : result.first().config.aliases.map(a => a))
              .addField(`Category:`, result.first().config.commandCategory);
            message.channel.send(embed);
          }
        });
      }).catch((e) => {
        funcs.send(`You ran out of time or an error occured!`);
        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
      });
    });
  } catch (e) {
    console.error;
    funcs.send(`Oh no, an error occurred!\n${e.message}`);
  }
};

module.exports.config = {
  name: "findcommand",
  aliases: [],
  usage: "Helps you find commands.",
  commandCategory: "info",
  cooldownTime: "0"
};
