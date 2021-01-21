const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.play(message, args, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "play",
    aliases: [],
    usage: "Play music with the bot.",
    commandCategory: "music",
    cooldownTime: "10"
  };