const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
        Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("No mentions found in your message.");
    const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/plate_shit.png');
        const png = person.replace('.gif', '.png');
        const {
            body
        } = await request.get(png);
        return new Canvas(634, 775)
            .setColor(0x00A2E8)
            .addRect(0, 0, 434, 675)
            .addImage(plate, 0, 0, 634, 775)
            .addImage(body, 200, 505, 169, 169, {
                type: 'round',
                radius: 85
            })
            .toBuffer();
    };
    try {
        const person = message.mentions.users.first().avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
            files: [{
                attachment: result,
                name: 'power.png'
            }]
        });
    } catch (error) {
        throw error;
    }
};

module.exports.config = {
    name: "shit",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };