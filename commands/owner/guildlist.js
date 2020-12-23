const { richEmbed } = require('discord.js');
module.exports.run = (bot, message, args, funcs) => {
  if (message.author.id !== "130515926117253122" && message.author.id !== "307472480627326987") return message.channel.send("Only bot owner can use this command.");
  try {
    let guilds = bot.guilds.map(g => `Name: ${g.name}, Membercount: ${g.members.size}, ID: ${g.id}`).join('\n');
    if (bot.guilds.size >= 1) {
      message.channel.send("```" + guilds + "```", {
        split: {
          prepend: "```",
          append: "```"
        }
      });
      return;
    }
    let embed = new richEmbed()
      .setTimestamp()
      .setThumbnail(bot.user.avatarURL)
      .setFooter(`Total guilds: ${bot.guilds.size}`)
      .setColor(funcs.rc())
    bot.guilds.forEach(guild => {
      embed.addField(`__**${guild.name}**__`, `Owner: ${guild.owner.user.tag}\nMembercount: ${guild.members.size}\nID: ${guild.id}`)
    });
    message.channel.send(embed);
  } catch (e) {
    console.log(e);
    funcs.send(`Oh no, an error occurred!\n${e.message}`);
  }
};

module.exports.config = {
  name: "guildlist",
  aliases: [],
  usage: "Allows you to see what guilds the bot is in.",
  commandCategory: "owner",
  cooldownTime: '0'
};
