const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
        const {
            Canvas
        } = require('canvas-constructor');
        if (message.mentions.users.size < 1) return send("You didn't mention a user to slap.");
        const getSlapped = async (slapper, slapped) => {
            const plate = await fsn.readFile('./assets/images/Who-Would-Win.png');
            const png = slapper.replace('.gif', '.png');
            const png1 = slapped.replace(`.gif`, `.png`);
            const pngSlapper = await request.get(png);
            const pngSlapped = await request.get(png1);
            return new Canvas(802, 500)
                .addImage(plate, 0, 0, 802, 500)
                .addImage(pngSlapper.body, 41, 124, 318, 325)
                .addImage(pngSlapped.body, 461, 124, 318, 325)
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
                    name: 'who-would-win.png'
                }]
            });
        } catch (error) {
            throw error;
        }
};

module.exports.config = {
    name: "whowouldwin",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };