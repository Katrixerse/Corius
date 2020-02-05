module.exports.run = (bot, message, args, funcs) => {
    try {
        funcs.send('Bots offical website: https://corius.site');
    } catch (err) {
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
  name: "website",
  aliases: [],
  usage: "Sends you the bots website.",
  commandCategory: "info",
  cooldownTime: "0"
};
