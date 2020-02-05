module.exports.run = async (bot, message, args, funcs, con) => {
    con.query(`SELECT economyEnabled AS economy FROM guildSettings WHERE guildId ="${message.guild.id}"`, async (e, row2) => {
        if (row2[0].economy == "false") return;
        con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, (e, row) => {
            try {
                row = row[0];
                var chance = [
                    ":fish: You've caught a normal fish and got 60$!",
                    ":tropical_fish: You've caught a tropical fish and got 200$!",
                    ":mans_shoe: You've caught a shoe and got 1$!"
                ];
                let random = chance[Math.floor(Math.random() * chance.length)];
                if (random.includes('normal fish')) {
                    funcs.send(random);
                    con.query(`UPDATE guildCash SET userCash = ${row.userCash + 60} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                } else if (random.includes('tropical fish')) {
                    funcs.send(random);
                    con.query(`UPDATE guildCash SET userCash = ${row.userCash + 200} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                } else {
                    funcs.send(random);
                    con.query(`UPDATE guildCash SET userCash = ${row.userCash + 1} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                }
            } catch (err) {
                console.log(err) 
                return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
              }
        });
    });
};

module.exports.config = {
    name: "fish",
    aliases: [],
    usage: "Use this command to go fishing for money. (1 hour cooldown)",
    commandCategory: "economy",
    cooldownTime: '3600'
};