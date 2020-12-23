const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, row) => {
            if (row[0].economy == "false") return;
            const slots = [':grapes:', ':cherries:', ':lemon:'];
            const slotOne = slots[Math.floor(Math.random() * slots.length)];
            const slotTwo = slots[Math.floor(Math.random() * slots.length)];
            const slotThree = slots[Math.floor(Math.random() * slots.length)];
            const slotFour = slots[Math.floor(Math.random() * slots.length)];
            const slotFive = slots[Math.floor(Math.random() * slots.length)];
            const slotSix = slots[Math.floor(Math.random() * slots.length)];
            const slotSeven = slots[Math.floor(Math.random() * slots.length)];
            const slotEight = slots[Math.floor(Math.random() * slots.length)];
            const slotNine = slots[Math.floor(Math.random() * slots.length)];
            con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, (e, row1) => {
                row1 = row1[0];
                let bet = parseInt(args.join(` `));
                if (!bet) return funcs.send(`Please enter a number to bet!`);
                if (isNaN(bet)) return funcs.send(`Not a valid number to bet!`);
                if (!isFinite(bet)) return funcs.send(`Not a valid number to bet!`);
                if (row1.money < bet) return funcs.send(`You don't have that much to bet! You only have ${row1.money}$!`);
                if (slotOne === slotTwo && slotOne === slotThree || slotFour === slotFive && slotFour === slotSix || slotSeven === slotEight && slotSeven === slotNine) {
                    let wonamount = Math.floor(bet * 3);
                    con.query(`UPDATE guildCash SET userCash = ${row1.userCash + wonamount} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                    let wonembed = new richEmbed()
                        .setTitle(`You have Won!`)
                        .setColor(funcs.rc())
                        .addField("Line 1:", `${slotFour}|${slotFive}|${slotSix}`)
                        .addField("Line 2:", `${slotOne}|${slotTwo}|${slotThree}`)
                        .addField("Line 3:", `${slotSeven}|${slotEight}|${slotNine}`)
                        .addField(`You have won:`, wonamount + "$")
                        .setTimestamp()
                        .setThumbnail(bot.user.avatarURL);
                    message.channel.send(wonembed);
                } else {
                    let lostamount = Math.floor(bet * 3);
                    con.query(`UPDATE guildCash SET userCash = ${row1.userCash - lostamount} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                    let lostembed = new richEmbed()
                        .setTitle(`You have Lost!`)
                        .setColor(funcs.rc())
                        .addField("Line 1:", `${slotFour}|${slotFive}|${slotSix}`)
                        .addField("Line 2:", `${slotOne}|${slotTwo}|${slotThree}`)
                        .addField("Line 3:", `${slotSeven}|${slotEight}|${slotNine}`)
                        .addField(`You have lost:`, lostamount + "$")
                        .setTimestamp()
                        .setThumbnail(bot.user.avatarURL);
                    message.channel.send(lostembed);
                }
            });
        });
    } catch (err) {
        console.log(err) 
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
      }
};

module.exports.config = {
    name: "slots",
    aliases: [],
    usage: "Use this command to gamgle.",
    commandCategory: "economy",
    cooldownTime: '3'
};