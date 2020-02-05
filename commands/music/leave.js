const musicfuncs = require('../../assets/handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.leave(message, bot, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "leave",
    aliases: [],
    usage: "Leaves the current voice chat",
    commandCategory: "music",
    cooldownTime: "0"
  };