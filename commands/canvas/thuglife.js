const request = require('node-superfetch');
const fsn = require("fs-nextra");
module.exports.run = async (bot, message, args, funcs) => {
    const {
        Canvas
    } = require('canvas-constructor');
    if (message.mentions.users.size < 1) return send("No mentions found in your message.");
    const getSlapped = async (person) => {
        const plate = await fsn.readFile('./assets/images/thug-life.png');
        const png = person.replace('.gif', '.png');
        const {
            body
        } = await request.get(png);
        return new Canvas(250, 250)
            .resetTransformation()
            .addImage(body, 0, 0, 250, 250)
            .addImage(plate, 0, 0, 250, 250)
            .toBuffer();
    };
    try {
        const person = message.mentions.users.first().avatarURL;
        const result = await getSlapped(person);
        await message.channel.send({
            files: [{
                attachment: result,
                name: 'thuglife.png'
            }]
        });
    } catch (error) {
        throw error;
    }
};

module.exports.config = {
    name: "thuglife",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };