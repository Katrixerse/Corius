const req = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  try {
    const {
      body
    } = await req.get('http://api.adviceslip.com/advice');
    funcs.send(JSON.parse(body.toString()).slip.advice);
  } catch (e) {
    console.log(e);
    funcs.send(`Oh no, an error occurred!\n${e.message}`);
  }
};

module.exports.config = {
  name: "advice",
  aliases: [],
  usage: "Use this command to get some advice.",
  commandCategory: "fun",
  cooldownTime: "5"
};