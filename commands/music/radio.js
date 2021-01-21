const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.radio(message, args, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "radio",
    aliases: [],
    usage: "Plays music from the radio.",
    commandCategory: "music",
    cooldownTime: "0"
  };