const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
        const {
            Canvas
        } = require('canvas-constructor');
        if (message.mentions.users.size < 1) return send("No mentions found in your message.");
        const getSlapped = async (person) => {
            const plate = await fsn.readFile('./assets/images/challenger.png');
            const png = person.replace('.gif', '.png');
            const {
                body
            } = await request.get(png);
            return new Canvas(800, 450)
            .setColor(0x6B363E)
            .addImage(plate, 0, 0, 800, 450)
            .addImage(body, 484, 98, 256, 256)
            .toBuffer();
        };
        try {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({
                files: [{
                    attachment: result,
                    name: 'challenger.png'
                }]
            });
        } catch (error) {
            throw error;
        }
};

module.exports.config = {
    name: "challenger",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };