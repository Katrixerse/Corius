const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
        Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("No mentions found in your message.");
    const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/look-what-karen-have.png');
        const png = person.replace('.gif', '.png');
        const {
            body
        } = await request.get(png);
        return new Canvas(768, 432)
            .rotate(-6.5 * (Math.PI / 180))
            .addImage(body, 514, 50, 512, 512)
            .rotate(6.5 * (Math.PI / 180))
            .addImage(plate, 0, 0, 768, 432)
            .toBuffer();
    };
    try {
        const person = message.mentions.users.first().avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
            files: [{
                attachment: result,
                name: 'look.png'
            }]
        });
    } catch (error) {
        throw error;
    }
};

module.exports.config = {
    name: "look",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };