const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT economyEnabled AS economy FROM guildSettings WHERE guildId ="${message.guild.id}"`, async (e, row2) => {
        if (row2[0].economy == "false") return;
        con.query(`SELECT * FROM guildCash WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row) => {
            if (!row || row.length == 0 || row[0].userCash == 0) return funcs.send(`You have no money to deposit!`)
            row = row[0];
            message.channel.send(`__**How much money would you like to deposit? (type an amount or say all) Type exit to cancel.**__`).then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    errors: ["time"],
                    time: 30000
                }).then((response) => {
                    response = response.array()[0].content;
                    if (response == "exit") return funcs.send(`Command canceled!`);
                    if (response == "all") {
                        const moneyToDep = parseInt(row.userCash);
                        con.query(`UPDATE guildCash SET userCash = 0, userBankedCash = ${row.userBankedCash + moneyToDep} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                        const em = new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setColor(funcs.rc())
                            .setFooter(bot.user.username)
                            .addField(`Old bank amount:`, `$${row.userBankedCash}`)
                            .addField(`New bank amount:`, `$${row.userBankedCash + moneyToDep}`)
                            .setDescription(`Deposited $${moneyToDep}.`)
                            .setThumbnail(message.author.avatarURL);
                        message.channel.send(em);
                    } else {
                        const moneyToDep = parseInt(response);
                        if (isNaN(moneyToDep) || moneyToDep <= 0) return funcs.send(`Not a valid amount to deposit!`);
                        if (moneyToDep >= row.userCash) return funcs.send(`You do not have that much money to deposit! ($${row.userCash})`);
                        con.query(`UPDATE guildCash SET userCash = ${row.userCash - moneyToDep}, userBankedCash = ${row.userBankedCash + moneyToDep} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                        const em = new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL)
                            .setColor(funcs.rc())
                            .setFooter(bot.user.username)
                            .addField(`Old bank amount:`, "$" + row.userBankedCash)
                            .addField(`New bank amount:`, `$${parseInt(row.userBankedCash) + parseInt(moneyToDep)}`)
                            .setDescription(`Deposited $${moneyToDep}.`)
                            .setThumbnail(message.author.avatarURL);
                        message.channel.send(em);
                    }
                }).catch((err) => {
                    console.log(err) 
                    return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                });
            });
        });
    });
};

module.exports.config = {
    name: 'deposit',
    aliases: ["dep"],
    usage: "Use this command to deposit money",
    commandCategory: "economy",
    cooldownTime: '0'
};