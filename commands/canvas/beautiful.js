const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
      Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("You didn't mention a user to make beautiful.");
    const getSlapped = async (person) => {
      const plate = await fsn.readFile('./assets/images/beautiful.png');
      const png = person.replace('.gif', '.png');
      const {
        body
      } = await request.get(png);
      return new Canvas(480, 640)
        .setColor(0x00A2E8)
        .addImage(plate, 0, 0, 480, 640)
        .addImage(body, 287, 170, 200, 200, {
          type: "round",
          radius: 100
        })
        //.restore()
        .toBuffer();
    };
    try {
        const person = message.mentions.users.first().avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
          files: [{
            attachment: result,
            name: 'beautiful.png'
          }]
        });
    } catch (error) {
      throw error;
    }
};

module.exports.config = {
  name: "beautiful",
  aliases: [],
  usage: "",
  commandCategory: "canvas",
  cooldownTime: '0'
};