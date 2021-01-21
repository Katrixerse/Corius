const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.clearqueue(message, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "clearqueue",
    aliases: [],
    usage: "Removes everything in the queue",
    commandCategory: "music",
    cooldownTime: "0"
  };