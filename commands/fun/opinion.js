const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      message.channel.send(`***Enter the object to get my opinion about or type exit to cancel***`)
        .then(() => {
          message.channel.awaitMessages(m => m.author.id === message.author.id, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
            .then((obj1) => {
              if (!obj1) return;
              obj1 = obj1.array()[0];
              let opinions = [`I have a good opinion about ${obj1.content}! :+1:`, `I hate ${obj1.content}.. :nauseated_face:`, `${obj1.content} is okay, I guess.`];
              let opinion = opinions[Math.floor(Math.random() * opinions.length)];
              let embed = new richEmbed()
                .setTimestamp()
                .setColor(funcs.rc())
                .setDescription(`My opinion: ${opinion}`)
                .setThumbnail(bot.user.avatarURL);
              message.channel.send(embed);
            })
            .catch((e) => {
              console.log(e);
              send(`Time has expired.`);
            });
        });
  } catch (e) {
    console.error;
    send(`Oh no! An error occurred! \`${e.message}\`.`);
  }
};

module.exports.config = {
  name: "opinion",
  aliases: [],
  usage: "Bot gives you his opinion on something.",
  commandCategory: "fun",
  cooldownTime: '5'
};