const {
    richEmbed
} = require('discord.js');

module.exports.run = (bot, message, args, funcs) => {
    const validPicks = ["rock", "paper", "scrissors"];
    const userPick = args.join(` `).toLowerCase();
    if (!validPicks.includes(userPick) || !userPick) return funcs.send(`Your pick wasn't rock, paper, nor scrissors (not a valid pick)!`, true);
    const botPicked = validPicks[Math.floor(Math.random() * validPicks.length)];
    //Rock
    if (userPick == "rock" && botPicked == "rock") return funcs.send(`You picked rock and I also picked rock. It's a tie!`);
    if (userPick == "rock" && botPicked == "paper") return funcs.send(`You picked rock and I also picked rock. You beat me! :rage:`);
    if (userPick == "rock" && botPicked == "scrissors") return funcs.send(`You picked rock and I also picked rock. I beat you! :sweat_smile:`);
    //Paper
    if (userPick == "paper" && botPicked == "paper") return funcs.send(`You picked ${userPick} and I picked ${botPicked}. It's a tie!`);
    if (userPick == "paper" && botPicked == "rock") return funcs.send(`You picked ${userPick} and I picked ${botPicked}. You beat me! :rage:`);
    if (userPick == "paper" && botPicked == "scrissors") return funcs.send(`You picked ${userPick} and I picked ${botPicked}. I beat you! :sweat_smile:`);
    //Scrissors
    if (userPick == "scrissors" && botPicked == "scrissors") return funcs.send(`You picked ${userPick} and I picked ${botPicked}. It's a tie!`);
    if (userPick == "scrissors" && botPicked == "rock") return funcs.send(`You picked ${userPick} and I picked ${botPicked}. I beat you! :sweat_smile:`);
    if (userPick == "scrissors" && botPicked == "paper") return funcs.send(`You picked ${userPick} and I picked ${botPicked}. You beat me! :rage:`);
};

module.exports.config = {
    name: "rps",
    aliases: [],
    usage: "Use this command to play rock paper scrissors with the bot.",
    commandCategory: "fun",
    cooldownTime: '5'
};