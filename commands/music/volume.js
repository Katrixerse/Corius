const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.volume(message, args, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "volume",
    aliases: [],
    usage: "Allows you to control the musics volume.",
    commandCategory: "music",
    cooldownTime: "0"
  };