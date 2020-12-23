const { MessageEmbed } = require('discord.js');
module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT * FROM userNotes WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, notes) => {
        message.channel.send(`__**What would you like to do?**__\n\`\`\`Add a note (type 1)\nDelete a note (type 2)\nView your notes (type 3)\nType exit to cancel.\`\`\``).then(() => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                errors: ["time"],
                time: 30000
            }).then((response) => {
                response = response.array()[0].content;
                if (response == "1") {
                    if (notes !== undefined && notes.length >= 20) return funcs.send(`Too many notes! (20) Please delete some and try again!`);
                    message.channel.send(`__**What is the note you would like to add?**__`).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then((response) => {
                            const note = response.array()[0].content;
                            con.query(`INSERT INTO userNotes (guildId, userId, note, addedAt) VALUES (?, ?, ?, ?)`, [message.guild.id, message.author.id, note, new Date().toDateString()]);
                            funcs.send(`Note added!`);
                        }).catch((e) => {
                            funcs.send(`You ran out of time or an error occured!`);
                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                        });
                    });
                } else if (response == "2") {
                    if (notes == undefined || notes.length == 0) return funcs.send(`You dont have any notes to delete!`);
                    let n = 0;
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setColor(funcs.rc())
                        .setFooter(bot.user.username)
                        .setDescription(`Which note would you like to delete? (type the number bount to the note) Type exit to cancel.`)
                        .setThumbnail(message.author.avatarURL);
                    notes.forEach(note => {
                        embed.addField(`${n += 1}#:`, `Note: ${note.note}\nAdded at: ${note.addedAt}`);
                    });
                    n = 0;
                    message.channel.send(embed).then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            errors: ["time"],
                            time: 30000
                        }).then((response) => {
                            response = response.array()[0].content;
                            if (response == "exit") return funcs.send(`Command canceled!`);
                            const num = parseInt(response);
                            if (isNaN(num) || num > notes.length || num <= 0) return funcs.send(`Not a valid number!`);
                            embed.fields.forEach(field => {
                                if (field.name.startsWith(num)) {
                                    const note = field.value.split("\n")[0].split(/ +/g)[1];
                                    funcs.send(`Note deleted!`);
                                    con.query(`DELETE FROM userNotes WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}" AND note ="${note}"`);
                                }
                            });
                        }).catch((e) => {
                            funcs.send(`You ran out of time or an error occured!`);
                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                        });
                    });
                } else if (response == "3") {
                    if (notes == undefined || notes.length == 0) return funcs.send(`You dont have any notes to view!`);
                    let n = 0;
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setColor(funcs.rc())
                        .setFooter(bot.user.username)
                        .setThumbnail(message.author.avatarURL);
                    notes.forEach(note => {
                        embed.addField(`${n += 1}#:`, `Note: ${note.note}\nAdded at: ${note.addedAt}`);
                    });
                    embed.setTitle(`${n} note(s).`);
                    n = 0;
                    message.channel.send(embed);
                } else {
                    funcs.send(`Command canceled!`);
                }
            }).catch((e) => {
                funcs.send(`You ran out of time or an error occured!`);
                console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
            });
        });
    });
};

module.exports.config = {
    name: "notes",
    aliases: [],
    usage: "Use this command to manage your notes.",
    commandCategory: "fun",
    cooldownTime: '2'
};