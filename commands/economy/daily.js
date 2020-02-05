module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, row) => {
            if (row[0].economy == "false") return;
            con.query(`SELECT * FROM guildCash WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row2) => {
                if (!row2) {
                    console.log('inserting in guildCash from daily')
                    con.query(`INSERT INTO guildCash (guildId, userId, userCash, userBankedCash, username, hasRecievedCash, hasBeenRobbed, has_cheated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, cashToGive, 0, message.author.username, "false", "false", "false"]);
                }
                con.query(`UPDATE guildCash SET userCash = ${row2[0].userCash + 500} WHERE guildId = ${message.guild.id}  AND userId = ${message.author.id}`);
                funcs.send(`You got your daily 500$.`);
            });
        });
    } catch (err) {
        console.log(err) 
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
      }
};

module.exports.config = {
    name: "daily",
    aliases: [],
    usage: "Use this command to get your daily cash. (1 day cooldown)",
    commandCategory: "economy",
    cooldownTime: '86400'
};