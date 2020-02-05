const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
      Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("You didn't mention a user to ban.");
    const getSlapped = async (person) => {
      const plate = await fsn.readFile('./assets/images/banned.png');
      const png = person.replace('.gif', '.png');
      const {
        body
      } = await request.get(png);
      return new Canvas(1851, 1828)
        .setColor(0x00A2E8)
        .addImage(body, 0, 0, 1851, 1828)
        //.restore()
        .addImage(plate, 0, 0, 1851, 1828)
        .toBuffer();
    };
    try {
      if (message.mentions.users.size < 1) {
        const person = message.author.avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
          files: [{
            attachment: result,
            name: 'banned.png'
          }]
        });
      } else {
        const person = message.mentions.users.first().avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
          files: [{
            attachment: result,
            name: 'rude.png'
          }]
        });
      }
    } catch (error) {
      throw error;
    }
};

module.exports.config = {
  name: "banned",
  aliases: [],
  usage: "",
  commandCategory: "canvas",
  cooldownTime: '0'
};