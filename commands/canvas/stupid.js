const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
        Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return message.channel.send("You didn't mention a user to make stupid.");
    const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/stupid.png');
        const png = person.replace('.gif', '.png');
        const {
            body
        } = await request.get(png);
        return new Canvas(900, 500)
            .setColor(0x00A2E8)
            .addImage(plate, 0, 0, 900, 500)
            .addImage(body, 650, 230, 230, 230, {
                type: 'round',
                radius: 115
            })
            .restore()
            .toBuffer();
    };
    try {
        if (message.mentions.users.size < 1) {
            const person = message.author.avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({
                files: [{
                    attachment: result,
                    name: 'stupid.png'
                }]
            });
        } else {
            const person = message.mentions.users.first().avatarURL;
            const result = await getSlapped(person);
            await message.channel.send({
                files: [{
                    attachment: result,
                    name: 'stupid.png'
                }]
            });
        }
    } catch (error) {
        throw error;
    }
};

module.exports.config = {
    name: "stupid",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };