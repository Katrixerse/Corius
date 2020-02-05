module.exports.run = async (bot, message, args, funcs) => {
      try {
        let num = parseInt(args.join(` `));
        if (!num) return funcs.send(`Please provide a number to roll the dice!`);
        if (isNaN(num)) return funcs.send(`Not a valid number to roll.`);
        if (!isFinite(num)) return funcs.send(`Cannot roll an infinite number.`);
        let dice = Math.floor(Math.random() * num) + 1;
        funcs.send(`The dice rolled ${dice}.`);
      } catch (e) {
        console.error;
        funcs.send(`Oh no, an error occurred!\n${e.message}`);
      }
};

module.exports.config = {
  name: "roll",
  aliases: [],
  usage: "Roll the dice.",
  commandCategory: "fun",
  cooldownTime: '5'
};