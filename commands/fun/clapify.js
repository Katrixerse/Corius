module.exports.run = (bot, message, args, funcs) => {
  try {
    let text = args.join(` `);
    if (!text) return funcs.send(`You can't clapify nothing.`);
    funcs.send(`:clap: ${text} :clap:`);
  } catch (err) {
    console.log(err)
    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};

module.exports.config = {
  name: "clapify",
  aliases: [],
  usage: "Meme review.",
  commandCategory: "fun",
  cooldownTime: '5'
};