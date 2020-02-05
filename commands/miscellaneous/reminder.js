const ms = require("ms");
module.exports.run = (bot, message, args, funcs) => {
    const time = args[0];
    if (!time) return funcs.send(`Missing argument: --> time + s (seconds) / m (minutes) / h (hours) / d (days) <-- reminder\nExample: reminder 2m to eat`);
    if (!time.endsWith("s") && !time.endsWith("m") && !time.endsWith("h") && !time.endsWith("d")) return funcs.send(`Not a valid time.`);
    const actualTime = parseInt(ms(time));
    if (isNaN(actualTime) || actualTime <= parseInt(ms('1s'))) return funcs.send(`Not a valid time.`);
    if (actualTime >= parseInt(ms("5d"))) return funcs.send(`Time cannot be higher than 5 days.`);
    const reminder = args.slice(1).join(` `);
    if (!reminder) return funcs.send(`Missing argument: time --> reminder <--`);
    const rmd = reminder.substr(0, 700);
    funcs.send(`:alarm_clock: I will remind you in ${time}!`)
    setTimeout(() => {
        funcs.send(`${message.member}, you asked me to remind you: ${rmd}`);
    }, actualTime);
};

module.exports.config = {
    name: "reminder",
    aliases: ["rmd"],
    usage: "Get reminded of something once a period of time has passed.",
    commandCategory: "miscellaneous",
    cooldownTime: "5"
};
