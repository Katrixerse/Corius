const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
  const {
    Canvas
  } = require('canvas-constructor');
  if (message.mentions.users.size < 1) return send("You didn't mention a user to jail.");
  const getSlapped = async (person) => {
    const plate = await fsn.readFile('./assets/images/jail.png');
    const png = person.replace('.gif', '.png');
    const {
      body
    } = await request.get(png);
    return new Canvas(420, 420)
      .resetTransformation()
      .addImage(body, 0, 0, 420, 420)
      .addImage(plate, 0, 0, 420, 420)
      .toBuffer();
  };
  try {
    const person = message.mentions.users.first().avatarURL;
    const result = await getSlapped(person);
    await message.channel.send({
      files: [{
        attachment: result,
        name: 'jailed.png'
      }]
    });
  } catch (error) {
    throw error;
  }
};

module.exports.config = {
  name: "jail",
  aliases: [],
  usage: "",
  commandCategory: "canvas",
  cooldownTime: '0'
};