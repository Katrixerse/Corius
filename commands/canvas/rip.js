const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
        const {
            Canvas
        } = require('canvas-constructor');
        if (message.mentions.users.size < 1) return send("No mentions found in your message.");
        const getSlapped = async (person) => {
            const plate = await fsn.readFile('./assets/images/pay_respects.png');
            const png = person.replace('.gif', '.png');
            const {
                body
            } = await request.get(png);
            return new Canvas(720, 405)
                .addRect(0, 0, 720, 405)
                .setColor('#000000')
                .addImage(body, 110, 45, 90, 90)
                .resetTransformation()
                .addImage(plate, 0, 0, 720, 405)
                .toBuffer();
        };
        try {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({
                files: [{
                    attachment: result,
                    name: 'rip.png'
                }]
            });
        } catch (error) {
            throw error;
        }
};

module.exports.config = {
    name: "rip",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };