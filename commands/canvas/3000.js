const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
      Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("You didn't mention a user.");
    const getSlapped = async (person) => {
      const plate = await fsn.readFile('./assets/images/3000-years.png');
      const png = person.replace('.gif', '.png');
      const {
        body
      } = await request.get(png);
      return new Canvas(856, 569)
      .resetTransformation()
      .addImage(plate, 0, 0, 856, 569)
      .addImage(body, 461, 127, 200, 200)
      .toBuffer();
    };
    try {
        const person = message.mentions.users.first().avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
          files: [{
            attachment: result,
            name: '3000.png'
          }]
        });
    } catch (error) {
      throw error;
    }
};

module.exports.config = {
  name: "3000",
  aliases: [],
  usage: "",
  commandCategory: "canvas",
  cooldownTime: '0'
};