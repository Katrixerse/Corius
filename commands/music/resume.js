const musicfuncs = require('../../assets/handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.resume(message, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "resume",
    aliases: [],
    usage: "Resume paused music.",
    commandCategory: "music",
    cooldownTime: "0"
  };