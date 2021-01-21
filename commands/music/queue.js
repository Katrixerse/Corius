const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.queue(message, funcs);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "queue",
    aliases: [],
    usage: "Views the current queue in the server.",
    commandCategory: "music",
    cooldownTime: "0"
  };