const { RichEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
  try {
      message.channel.send(`***Enter the first object to pick from or type exit to cancel***`)
        .then(() => {
          message.channel.awaitMessages(m => m.author.id === message.author.id, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
            .then((obj1) => {
              if (!obj1) return;
              obj1 = obj1.array()[0];
              message.channel.send(`***Now enter the second object.***`)
                .then(() => {
                  message.channel.awaitMessages(m => m.author.id === message.author.id, {
                      max: 1,
                      time: 30000,
                      errors: ['time'],
                    })
                    .then((obj2) => {
                      if (!obj2) return;
                      obj2 = obj2.array()[0];
                      if (obj2.content == obj1.content) return funcs.send(`Can't choose between the same thing.`);
                      let random = Math.floor(Math.random() * 100);
                      //let random1 = Math.floor(Math.random() * 100);
                      let obj1chance = 100 - random;
                      let obj2chance = 100 - obj1chance;
                      if (obj1chance > obj2chance) {
                        let embed = new RichEmbed()
                          .setTimestamp()
                          .setColor(funcs.rc())
                          .setTitle(`I have picked..`)
                          .setDescription(`Picked object: ${obj1.content}`)
                          .addField(`Chance to pick ${obj1.content}:`, `${obj1chance}%`)
                          .addField(`Chance to pick ${obj2.content}:`, `${obj2chance}%`)
                          .setThumbnail(bot.user.avatarURL);
                        message.channel.send(embed);
                      } else if (obj1chance < obj2chance) {
                        let embed = new RichEmbed()
                          .setTimestamp()
                          .setColor(funcs.rc())
                          .setTitle(`I have picked..`)
                          .setDescription(`Picked object: ${obj2.content}`)
                          .addField(`Chance to pick ${obj1.content}:`, `${obj1chance}%`)
                          .addField(`Chance to pick ${obj2.content}:`, `${obj2chance}%`)
                          .setThumbnail(bot.user.avatarURL);
                        message.channel.send(embed);
                      } else {
                        let embed = new RichEmbed()
                          .setTimestamp()
                          .setColor(rc)
                          .setTitle(`I have picked..`)
                          .setDescription(`It was a tie! I picked both!`)
                          .addField(`Chance to pick ${obj1.content}:`, `${obj1chance}%`)
                          .addField(`Chance to pick ${obj2.content}:`, `${obj2chance}%`)
                          .setThumbnail(bot.user.avatarURL);
                        message.channel.send(embed);
                      }
                    })
                    .catch((e) => {
                      console.log(e);
                      funcs.send(`Time has expired.`);
                    });
                });
            })
            .catch((e) => {
              console.log(e);
              funcs.send(`Time has expired.`);
            });
        });
  } catch (e) {
    console.error;
    funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
  }
};

module.exports.config = {
  name: "random",
  aliases: [],
  usage: "Random.",
  commandCategory: "fun",
  cooldownTime: '5'
};