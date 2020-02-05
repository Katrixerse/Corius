const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
        Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("No mentions found in your message.");
    const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/the-ultimate-tattoo.png');
        const png = person.replace('.gif', '.png');
        const {
            body
        } = await request.get(png);
        return new Canvas(750, 1089)
            .setColor(0x6B363E)
            .addImage(plate, 0, 0, 750, 1089)
            .addImage(body, 200, 645, 320, 320, {
                type: 'round',
                radius: 156
            })
            .toBuffer();
    };
    try {
        const person = message.mentions.users.first().avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
            files: [{
                attachment: result,
                name: 'tattoo.png'
            }]
        });
    } catch (error) {
        throw error;
    }
};

module.exports.config = {
    name: "tattoo",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };