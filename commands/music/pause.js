const musicfuncs = require('../../assets/handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.pause(message, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "pause",
    aliases: [],
    usage: "Pauses the currently playing music.",
    commandCategory: "music",
    cooldownTime: "0"
  };