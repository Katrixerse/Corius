const request = require('node-superfetch');
const fsn = require("fs-nextra");

module.exports.run = async (bot, message, args, funcs) => {
        const {
            Canvas
        } = require('canvas-constructor');
        if (message.mentions.users.size < 1) return send("No mentions found in your message.");
        const getSlapped = async (person) => {
            const plate = await fsn.readFile('./assets/images/plate_delete.png');
            const png = person.replace('.gif', '.png');
            const {
                body
            } = await request.get(png);
            return new Canvas(550, 275)
                .setColor(0x00A2E8)
                .addRect(0, 0, 634, 675)
                .addImage(plate, 0, 0, 550, 275)
                .addImage(body, 92, 106, 139, 151)
                .toBuffer();
        };
        try {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({
                files: [{
                    attachment: result,
                    name: 'delete.png'
                }]
            });
        } catch (error) {
            throw error;
        }
};

module.exports.config = {
    name: "delete",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };