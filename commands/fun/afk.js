module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT * FROM afk WHERE guildId = '${message.guild.id}' AND userId = '${message.author.id}'`, (err, rows) => {
            if (err) return funcs.send(`An error occurred! Error: ${err.message}`);
            const reason = args.join(` `) || "No reason provided";
            if (!rows || rows.length == 0) {
                con.query(`INSERT INTO afk (guildId, userId, isAfk, afkReason) VALUES (?, ?, ?, ?)`, [message.guild.id, message.author.id, 1, reason]);
            }
            con.query(`UPDATE afk SET isAfk = 1, afkReason = "${reason}" WHERE guildId = '${message.guild.id}' AND userId = '${message.author.id}'`);
            funcs.send(`You are now afk for: ${reason}.`);
        });
    } catch (err) {
        console.log(err)
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
    name: "afk",
    aliases: [],
    usage: "Use this command to go afk.",
    commandCategory: "fun",
    cooldownTime: '5'
};