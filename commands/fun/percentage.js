module.exports.run = async (bot, message, args, funcs) => {
  try {
      let min = args[0];
      if (!min) return send(`Please provide a first number.`);
      let actualmin = parseInt(min);
      if (isNaN(actualmin)) return funcs.send(`Not a valid first number.`);
      let max = args[1];
      if (!max) return send(`Please provide a second number.`);
      let actualmax = parseInt(max);
      if (isNaN(actualmax)) return funcs.send(`Not a valid second number.`);
      let math = (actualmin / actualmax) * 100;
      send(`${min} is ${Math.floor(math)}% of ${max}`);
  } catch (e) {
    console.error;
    funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
  }
};

module.exports.config = {
  name: "percentage",
  aliases: [],
  usage: "Helps you calculate the percent.",
  commandCategory: "fun",
  cooldownTime: '5'
};