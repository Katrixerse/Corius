const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.shuffle(message, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "shuffle",
    aliases: [],
    usage: "Shuffles the songs in the queue.",
    commandCategory: "music",
    cooldownTime: "0"
  };