const musicfuncs = require('../../handlers/music.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        musicfuncs.radioStations(message);
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "radiostations",
    aliases: [],
    usage: "View what radio stations you can listen to.",
    commandCategory: "music",
    cooldownTime: "0"
  };