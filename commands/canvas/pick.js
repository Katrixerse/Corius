const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
        Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return funcs.send("No mentions found in your message.");
    const getSlapped = async (slapper, slapped) => {
        const plate = await fsn.readFile('./assets/images/drakeposting.png');
        const pngSlapper = slapper.replace('.gif', '.png');
        const pngSlapped = slapped.replace('.gif', '.png');
        const Slapper = await request.get(pngSlapper);
        const Slapped = await request.get(pngSlapped);
        return new Canvas(1024, 1024)
            .addImage(plate, 0, 0, 1024, 1024)
            .addImage(Slapper.body, 512, 0, 512, 512)
            .addImage(Slapped.body, 512, 512, 512, 512)
            .restore()
            .toBuffer();
    };
    try {
        const slapped = message.mentions.users.first().avatarURL;
        const slapper = message.author.avatarURL;
        const result = await getSlapped(slapper, slapped);
        await message.channel.send({
            files: [{
                attachment: result,
                name: 'pick.png'
            }]
        });
    } catch (error) {
        throw error;
    }
};

module.exports.config = {
    name: "pick",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };