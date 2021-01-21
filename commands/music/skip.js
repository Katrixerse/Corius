const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.skip(message, bot, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "skip",
    aliases: [],
    usage: "Skip the current playing song.",
    commandCategory: "music",
    cooldownTime: "0"
  };