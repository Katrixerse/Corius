const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
  const {
    Canvas
  } = require('canvas-constructor');
  if (message.mentions.users.size < 1) return send("You didn't mention a user to slap.");
  const getSlapped = async (slapper, slapped) => {
    const plate = await fsn.readFile('./assets/images/slap.png');
    const png = slapper.replace('.gif', '.png');
    const png1 = slapped.replace(`.gif`, `.png`);
    const pngSlapper = await request.get(png);
    const pngSlapped = await request.get(png1);
    return new Canvas(600, 600)
      .setColor(0x00A2E8)
      .resetTransformation()
      .addImage(plate, 0, 0, 600, 600)
      .addImage(pngSlapper.body, 270, 100, 200, 200)
      .addImage(pngSlapped.body, 10, 350, 250, 250)
      .toBuffer();
  };
  try {
    const slapped = message.mentions.users.first().avatarURL;
    const slapper = message.author.avatarURL;
    const result = await getSlapped(slapper, slapped);
    await message.channel.send({
      files: [{
        attachment: result,
        name: 'slap.png'
      }]
    });
  } catch (error) {
    throw error;
  }
};

module.exports.config = {
  name: "slap",
  aliases: [],
  usage: "",
  commandCategory: "canvas",
  cooldownTime: '0'
};