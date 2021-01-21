const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.removesong(message, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "removesong",
    aliases: [],
    usage: "Removes a song from the queue.",
    commandCategory: "music",
    cooldownTime: "0"
};