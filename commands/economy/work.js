module.exports.run = async (bot, message, args, funcs, con) => {
    con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, row) => {
        if (row[0].economy == "false") return;
        con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row) => {
            row = row[0];
            try {
                funcs.send(`You've worked and earned 500$!`);
                con.query(`UPDATE guildCash SET userCash = ${row.userCash + 500} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
            } catch (err) {
                console.log(err) 
                return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
              }
        });
    });
};

module.exports.config = {
    name: "work",
    aliases: [],
    usage: "Use this command to go to work and earn money. (1 day cooldown)",
    commandCategory: "economy",
    cooldownTime: '86400'
};