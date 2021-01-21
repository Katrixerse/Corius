const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.currentSong(message, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "currentsong",
    aliases: ['currsong'],
    usage: "Tells you whats currently playing",
    commandCategory: "music",
    cooldownTime: "0"
  };