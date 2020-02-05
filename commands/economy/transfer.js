module.exports.run = (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT economyEnabled AS economy FROM guildSettings WHERE guildId ="${message.guild.id}"`, (e, row) => {
            if (row[0].economy == "false") return;
            con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, (e, row1) => {
                if (!row1 || row1.length == 0) return funcs.send(`It looks like you haven't earned any cash yet!`);
                row1 = row1[0];
                message.channel.send(`**__Who would you like to transfer cash to? (mention)__**`)
                    .then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((resp) => {
                                if (!resp) return;
                                resp = resp.array()[0];
                                let user = resp.mentions.members.first();
                                if (!user) return funcs.send(`Please mention somebody.`);
                                if (user.id == message.author.id) return funcs.send(`Cannot transfer money to yourself..`);
                                con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`, (e, row2) => {
                                    row2 = row2[0];
                                    message.channel.send(`**__How much would you like to transfer to that user? (you have ${row1.userCash}$)__**`)
                                        .then(() => {
                                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                max: 1,
                                                time: 30000,
                                                errors: ['time'],
                                            })
                                                .then(async (resp) => {
                                                    if (!resp) return;
                                                    resp = resp.array()[0];
                                                    let num = parseInt(resp.content);
                                                    if (isNaN(num) || num <= 0) return funcs.send(`Not a valid number to transfer.`);
                                                    if (num > row1.money) return funcs.send(`You don't have that much to transfer.`);
                                                    con.query(`UPDATE guildCash SET userCash = ${row1.userCash - num} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                                                    if (!row2) {
                                                        con.query(`INSERT INTO guildCash (guildId, userId, userCash, userBankedCash, username, hasRecievedCash, hasBeenRobbed, has_cheated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, user.id, num, 0, user.user.username, "false", "false", "false"]);
                                                    } else {
                                                        con.query(`UPDATE guildCash SET userCash = ${row2.userCash + num} WHERE guildId = ${message.guild.id} AND userId = ${user.id}`);
                                                    }
                                                    funcs.send(`Cash has been transfered.`);
                                                })
                                                .catch((err) => {
                                                    console.log(err) 
                                                    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                });
                                        });
                                })
                            });
                    });
            });
        });
    } catch (err) {
        console.log(err) 
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
      }
};

module.exports.config = {
    name: "transfer",
    aliases: ['trans'],
    usage: "Use this command to transfer money to somebody.",
    commandCategory: "economy",
    cooldownTime: '2'
};