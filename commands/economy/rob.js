module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, row) => {
        if (row[0].economy == "false") return;
        con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row) => {
            row = row[0];
            const userToRob = message.mentions.members.first();
            if (!userToRob) return funcs.send(`You did not mention anyone to rob!`);
            if (userToRob.bot || userToRob.id == message.author.id) return funcs.send(`Not a valid user to rob.`);
            const dice = Math.floor(Math.random() * 100) + 1;
            con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${userToRob.id}"`, (e, userRow) => {
                userRow = userRow[0];
                if (!userRow || userRow.userCash == 0) return funcs.send(`User does not have any money to rob!`);
                if (dice <= 50) {
                    const userMoney = userRow.userCash;
                    const randomNum = Math.floor(Math.random() * 40) + 1;
                    const robbedAmount = Math.floor(randomNum / 100 * userMoney);
                    if (robbedAmount > userMoney) robbedAmount = userMoney;
                    funcs.send(`You have robbed ${userToRob.user.username} for $${robbedAmount}!`);
                    con.query(`UPDATE guildCash SET userCash = ${row.userCash + robbedAmount} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                    con.query(`UPDATE guildCash SET userCash = ${userRow.userCash - robbedAmount} WHERE guildId = ${message.guild.id} AND userId = ${userToRob.id}`);
                } else {
                    const randomNum = Math.floor(Math.random() * 30) + 1;
                    const fine = Math.floor(randomNum / 100 * row.userCash);
                    if (fine > row.userCash) fine = row.userCash;
                    funcs.send(`You have been caught robbing ${userToRob.user.username} and got a fine of $${fine}!`);
                    con.query(`UPDATE guildCash SET userCash = ${row.userCash - fine} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                }
            });
        });
    });
};

module.exports.config = {
    name: 'rob',
    aliases: [],
    usage: "Use this command to rob somebody (1 hour cooldown)",
    commandCategory: "economy",
    cooldownTime: '3600'
};