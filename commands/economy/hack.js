module.exports.run = async (bot, message, args, funcs, con) => {
    con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, row) => {
        if (row[0].economy == "false") return;
        con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row) => {
            try {
                row = row[0];
                var katrix = await bot.fetchUser("130515926117253122");
                var andrew = await bot.fetchUser("307472480627326987");
                var thingstorob = [`${katrix.username}'s computer`, `${andrew}'s toaster`, `my fridge`, `the bank`, `the casino`, `${katrix.username}'s brain`, `Dyno`];
                let dice = Math.floor(Math.random() * 100);
                let cashtoget = Math.floor(Math.random() * 400) + 1;
                let fine = Math.floor(Math.random() * 1000) + 1;
                if (dice >= 50) {
                    funcs.send(`You've successfully hacked ${thingstorob[Math.floor(Math.random() * thingstorob.length)]} and got ${cashtoget}$!`);
                    con.query(`UPDATE guildCash SET userCash = ${row.userCash + cashtoget} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                } else {
                    funcs.send(`You've been caught trying to hack ${thingstorob[Math.floor(Math.random() * thingstorob.length)]} and got a fine of ${fine}$!`);
                    con.query(`UPDATE guildCash SET userCash = ${row.userCash - fine} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                }
            } catch (e) {
                console.error;
                funcs.send(`Oh no, an error occurred!\n${e.message}`);
            }
        });
    });
};

module.exports.config = {
    name: "hack",
    aliases: [],
    usage: "Use this command to hack something. (1 hour cooldown)",
    commandCategory: "economy",
    cooldownTime: '3600'
};