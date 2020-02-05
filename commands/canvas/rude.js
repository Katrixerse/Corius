const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
        Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("You didn't mention a user to make rude.");
    const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/rude.png');
        const png = person.replace('.gif', '.png');
        const {
            body
        } = await request.get(png);
        return new Canvas(1851, 1828)
            .setColor(0x00A2E8)
            .addImage(body, 0, 0, 1851, 1828)
            //.restore()
            .addImage(plate, 0, 0, 800, 80)
            .toBuffer();
    };
    try {
        const person = message.mentions.users.first().avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
            files: [{
                attachment: result,
                name: 'rude.png'
            }]
        });
    } catch (error) {
        throw error;
    }
};

module.exports.config = {
    name: "rude",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };