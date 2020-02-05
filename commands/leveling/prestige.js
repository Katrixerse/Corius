module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT * FROM guildSettings WHERE guildId ="${message.guild.id}"`, async (e, row) => {
        row = row[0];
        if (row.levelingEnabled == "false") return;
        con.query(`SELECT * FROM guildLeveling WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row2) => {
            if (row2.length == 0 || row2[0].userLevel < 50) return funcs.send(`You do not have enough levels to prestige! (you need level 50)`);
            con.query(`UPDATE guildLeveling SET userPrestige =${row2[0].userPrestige + 1}, userLevel=${row2[0].userLevel - 50}, userXP=${row2[0].userXP - 20000} WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`);
            funcs.send(`You have prestiged! (${row2[0].userPrestige + 1})`);
        });
    });
};

module.exports.config = {
    name: "prestige",
    aliases: [],
    usage: "Use this command to prestige.",
    commandCategory: "leveling",
    cooldownTime: "0"
};
