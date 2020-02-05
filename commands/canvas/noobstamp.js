const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
      Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("You didn't mention a user to noob!.");
    const getSlapped = async (person) => {
      const plate = await fsn.readFile('./assets/images/noobstamp.png');
      const png = person.replace('.gif', '.png');
      const {
        body
      } = await request.get(png);
      return new Canvas(501, 363)
        .addImage(body, 0, 0, 501, 363)
        .addImage(plate, 0, 0, 501, 363)
        //.restore()
        .toBuffer();
    };
    try {
      const person = message.mentions.users.first().avatarURL;
      const result = await getSlapped(person);
      await message.channel.send({
        files: [{
          attachment: result,
          name: 'lolnoob!.png'
        }]
      });
    } catch (error) {
      throw error;
    }
};

module.exports.config = {
  name: "noobstamp",
  aliases: [],
  usage: "",
  commandCategory: "canvas",
  cooldownTime: '0'
};