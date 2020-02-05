const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
        Canvas
      } = require('canvas-constructor');
      if (message.mentions.users.size < 1) return message.channel.send("You didn't mention a user to pornhub.");
      const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/ph.png');
        const png = person.replace('.gif', '.png');
        const {
          body
        } = await request.get(png);
        return new Canvas(640, 336)
          .resetTransformation()
          .addImage(body, 0, 0, 640, 336)
          .addImage(plate, 0, 0, 640, 336)
          .toBuffer();
      };
      try {
        const person = message.mentions.users.first().avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
          files: [{
            attachment: result,
            name: 'ph.png'
          }]
        });
      } catch (error) {
        throw error;
      }
};

module.exports.config = {
    name: "pornhub",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };