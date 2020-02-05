const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
      Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("Please mention somebody to transform into a toonie.");
    const getSlapped = async (person) => {
      const plate = await fsn.readFile('./assets/images/toonie.png');
      const png = person.replace('.gif', '.png');
      const {
        body
      } = await request.get(png);
      return new Canvas(550, 540)
        .addImage(plate, 0, 0, 550, 540)
        .addImage(body, 100, 100, 350, 350, {
          type: "round",
          radius: 175
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
          name: 'toonie.png'
        }]
      });
    } catch (error) {
      throw error;
    }
};

module.exports.config = {
  name: "toonie",
  aliases: [],
  usage: "",
  commandCategory: "canvas",
  cooldownTime: '0'
};