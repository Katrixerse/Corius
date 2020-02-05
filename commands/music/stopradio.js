const musicfuncs = require('../../assets/handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.stopRadio(message, bot, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "stopradio",
    aliases: [],
    usage: "Stops the radio from playing music.",
    commandCategory: "music",
    cooldownTime: "0"
  };