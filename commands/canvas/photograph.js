const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
        const {
            Canvas
        } = require('canvas-constructor');
        if (message.mentions.users.size < 1) return send("No mentions found in your message.");
        const getSlapped = async (person) => {
            const plate = await fsn.readFile('./assets/images/look-at-this-photograph.png');
            const png = person.replace('.gif', '.png');
            const {
                body
            } = await request.get(png);
            return new Canvas(620, 349)
                .setColor(0x00A2E8)
                .addImage(plate, 0, 0, 620, 349)
                .rotate(-13.5 * (Math.PI / 180))
                .addImage(body, 280, 218, 175, 125)
                .rotate(13.5 * (Math.PI / 180))
                .toBuffer();
        };
        try {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({
                files: [{
                    attachment: result,
                    name: 'photograph.png'
                }]
            });
        } catch (error) {
            throw error;
        }
};

module.exports.config = {
    name: "photograph",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };