const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const canvasFuncs = require('../../assets/handlers/canvas.js');
module.exports.run = async (bot, message, args, funcs) => {
    if (message.mentions.users.size < 1) return funcs.send("No mentions found in your message.");
	try {
        const { body } = await request.get(message.mentions.users.first().avatarURL);
        const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(data, 0, 0);
        canvasFuncs.contrast(ctx, 0, 0, data.width, data.height);
        const attachment = canvas.toBuffer();
        return message.channel.send({ files: [{ attachment, name: 'greyscale.png' }] });
    } catch (err) {
        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
    name: "contrast",
    aliases: [],
    usage: "",
    commandCategory: "canvas",
    cooldownTime: '0'
  };