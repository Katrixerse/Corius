var { richEmbed } = require("discord.js");
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query("SELECT cn.caseNumber, gs.logsEnabled, gp.prefix, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildPrefix AS gp ON cn.guildId = gp.guildId WHERE cn.guildId =\"" + message.guild.id + "\"", function (e, row) {
            con.query("SELECT guildMods FROM guildModerators WHERE guildId =\"" + message.guild.id + "\"", function (e, rows) {
                row = row[0];
                var row1 = rows.map(function (r) {
                    return r.guildMods;
                });
                con.query("SELECT * FROM guildSelfRoles WHERE guildId =\"" + message.guild.id + "\"", function (e, rows) {
                    message.channel.send("**__What would you like to do?__**\n```Add a selfrole to yourself (type 1)\nRemove a selfrole from yourself (type 2)\nSee current selfroles (type 3)\nAdd to current selfroles (type 4)\nRemove from current selfroles (type 5)\nType exit to cancel.```").then(function () {
                        message.channel.awaitMessages(function (m) {
                            return m.author.id == message.author.id;
                        }, {
                            errors: ['time'],
                            max: 1,
                            time: 30000
                        }).then(function (response) {
                            response = response.array()[0].content;
                            if (response == "1") {
                                var embed_1 = new richEmbed()
                                    .setTitle("Selfroles")
                                    .setColor(funcs.rc())
                                    .setTimestamp()
                                    .setDescription("Choose which selfrole to add by entering the number of it. Type exit to cancel.");
                                if (rows.length == 0)
                                    return funcs.send("No selfroles to add.");
                                var n_1 = 0;
                                rows.forEach(function (row) {
                                    embed_1.addField((n_1 += 1) + "#:", "" + row.selfRoles);
                                });
                                message.channel.send(embed_1).then(function () {
                                    message.channel.awaitMessages(function (m) {
                                        return m.author.id == message.author.id;
                                    }, {
                                        errors: ['time'],
                                        max: 1,
                                        time: 30000
                                    }).then(function (response) {
                                        response = response.array()[0].content;
                                        if (response == "exit")
                                            return funcs.send("Command canceled!");
                                        response = parseInt(response);
                                        if (isNaN(response) || response <= 0 || response > rows.length)
                                            return funcs.send("Not a valid number!");
                                        embed_1.fields.forEach(function (f) {
                                            if (f.name.startsWith(response)) {
                                                var rolePicked_1 = f.value;
                                                var finder1 = message.guild.roles.find(function (r) {
                                                    return r.name == rolePicked_1;
                                                });
                                                if (!finder1)
                                                    return funcs.send("Role not found in guild! It may have been deleted!");
                                                if (finder1.position >= message.guild.me.highestRole.position)
                                                    return funcs.send("Role has the same position or a higher position than me!");
                                                message.member.addRole(finder1);
                                                funcs.send("Role successfully added!");
                                                con.query("UPDATE guildCasenumber SET caseNumber = " + (row.caseNumber + 1) + " WHERE guildId = " + message.guild.id);
                                                if (row.logsEnabled !== "true")
                                                    return;
                                                var finder = message.guild.channels.find(function (c) {
                                                    return c.name == row.logsChannel;
                                                });
                                                if (!finder)
                                                    return;
                                                var embed_2 = new richEmbed()
                                                    .setTitle("Selfrole Added to Member.")
                                                    .setTimestamp()
                                                    .setAuthor(message.author.username, message.author.avatarURL)
                                                    .setThumbnail(bot.user.avatarURL)
                                                    .setColor(funcs.rc())
                                                    .addField("Role:", rolePicked_1)
                                                    .addField("Added by:", message.author.username)
                                                    .addField("Added at", message.createdAt.toDateString())
                                                    .addField("Case number:", "#" + (row.caseNumber + 1))
                                                    .addField("Message:", "[JumpTo](" + message.url + ")");
                                                message.guild.channels.get(finder.id).send(embed_2);
                                            }
                                        });
                                    })["catch"](function (e) {
                                        funcs.send("You ran out of time or an error occured!");
                                        console.log("Error: " + e.message + " in guild " + message.guild.name + " command commandName");
                                    });
                                });
                            } else if (response == "2") {
                                var embed_3 = new richEmbed()
                                    .setTitle("Selfroles")
                                    .setColor(funcs.rc())
                                    .setTimestamp()
                                    .setDescription("Choose which selfrole to remove by entering the number of it. Type exit to cancel.");
                                if (rows.length == 0)
                                    return funcs.send("No selfroles to remove.");
                                var n_2 = 0;
                                rows.forEach(function (row) {
                                    embed_3.addField((n_2 += 1) + "#:", "" + row.selfRoles);
                                });
                                message.channel.send(embed_3).then(function () {
                                    message.channel.awaitMessages(function (m) {
                                        return m.author.id == message.author.id;
                                    }, {
                                        errors: ['time'],
                                        max: 1,
                                        time: 30000
                                    }).then(function (response) {
                                        response = response.array()[0].content;
                                        if (response == "exit")
                                            return funcs.send("Command canceled!");
                                        response = parseInt(response);
                                        if (isNaN(response) || response <= 0 || response > rows.length)
                                            return funcs.send("Not a valid number!");
                                        embed_3.fields.forEach(function (f) {
                                            if (f.name.startsWith(response)) {
                                                var rolePicked_2 = f.value;
                                                var finder1 = message.guild.roles.find(function (r) {
                                                    return r.name == rolePicked_2;
                                                });
                                                if (!finder1)
                                                    return funcs.send("Role not found in guild! It may have been deleted!");
                                                if (finder1.position >= message.guild.me.highestRole.position)
                                                    return funcs.send("Role has the same position or a higher position than me!");
                                                message.member.removeRole(finder1);
                                                funcs.send("Role successfully removed!");
                                                con.query("UPDATE guildCasenumber SET caseNumber = " + (row.caseNumber + 1) + " WHERE guildId = " + message.guild.id);
                                                if (row.logsEnabled !== "true")
                                                    return;
                                                var finder = message.guild.channels.find(function (c) {
                                                    return c.name == row.logsChannel;
                                                });
                                                if (!finder)
                                                    return;
                                                var embed_4 = new richEmbed()
                                                    .setTitle("Selfrole Removed from Member.")
                                                    .setTimestamp()
                                                    .setAuthor(message.author.username, message.author.avatarURL)
                                                    .setThumbnail(bot.user.avatarURL)
                                                    .setColor(funcs.rc())
                                                    .addField("Role:", rolePicked_2)
                                                    .addField("Removed by:", message.author.username)
                                                    .addField("Removed at", message.createdAt.toDateString())
                                                    .addField("Case number:", "#" + (row.caseNumber + 1))
                                                    .addField("Message:", "[JumpTo](" + message.url + ")");
                                                message.guild.channels.get(finder.id).send(embed_4);
                                            }
                                        });
                                    }).catch((e) => {
                                        funcs.send(`You ran out of time or an error occured!`);
                                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                    });
                                });
                            } else if (response == "3") {
                                var embed_5 = new richEmbed()
                                    .setTitle("Selfroles")
                                    .setColor(funcs.rc())
                                    .setTimestamp();
                                //.setDescription(`Choose which selfrole to remove by entering the number of it. Type exit to cancel.`);
                                if (rows.length == 0)
                                    return funcs.send("No selfroles to view.");
                                var n_3 = 0;
                                rows.forEach(function (row) {
                                    embed_5.addField((n_3 += 1) + "#:", "" + row.selfRoles);
                                });
                                message.channel.send(embed_5);
                            } else if (response == "4") {
                                var permissionNeeded = "MANAGE_GUILD";
                                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id))
                                    return funcs.send("You do not have the permission " + permissionNeeded + " to use this command.", true);
                                message.channel.send("**__Which role would you like to add?__**").then(function () {
                                    message.channel.awaitMessages(function (m) {
                                        return m.author.id == message.author.id;
                                    }, {
                                        errors: ['time'],
                                        max: 1,
                                        time: 30000
                                    }).then(function (response) {
                                        response = response.array()[0].content;
                                        if (rows.filter(function (r) {
                                                return r.selfRoles == response;
                                            }).length > 0)
                                            return funcs.send("Selfrole already added!");
                                        var role = message.guild.roles.find(function (r) {
                                            return r.name == response;
                                        });
                                        if (!role)
                                            return funcs.send("Role not found!");
                                        con.query("INSERT INTO guildSelfRoles (guildId, selfRoles) VALUES (?, ?)", [message.guild.id, role.name]);
                                        funcs.send("Role successfully added!");
                                        con.query("UPDATE guildCasenumber SET caseNumber = " + (row.caseNumber + 1) + " WHERE guildId = " + message.guild.id);
                                        if (row.logsEnabled !== "true")
                                            return;
                                        var finder = message.guild.channels.find(function (c) {
                                            return c.name == row.logsChannel;
                                        });
                                        if (!finder)
                                            return;
                                        var embed = new richEmbed()
                                            .setTitle("Selfrole Added.")
                                            .setTimestamp()
                                            .setAuthor(message.author.username, message.author.avatarURL)
                                            .setThumbnail(bot.user.avatarURL)
                                            .setColor(funcs.rc())
                                            .addField("Role:", response)
                                            .addField("Added by:", message.author.username)
                                            .addField("Added at", message.createdAt.toDateString())
                                            .addField("Case number:", "#" + (row.caseNumber + 1))
                                            .addField("Message:", "[JumpTo](" + message.url + ")");
                                        message.guild.channels.get(finder.id).send(embed);
                                    })["catch"](function (e) {
                                        funcs.send("You ran out of time or an error occured!");
                                        console.log("Error: " + e.message + " in guild " + message.guild.name + " command commandName");
                                    });
                                });
                            } else if (response == "5") {
                                var permissionNeeded = "MANAGE_GUILD";
                                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id))
                                    return funcs.send("You do not have the permission " + permissionNeeded + " to use this command.", true);
                                var embed_6 = new richEmbed()
                                    .setTitle("Selfroles")
                                    .setColor(funcs.rc())
                                    .setTimestamp()
                                    .setDescription("Choose which selfrole to remove by entering the number of it. Type exit to cancel.");
                                if (rows.length == 0)
                                    return funcs.send("No selfroles to remove.");
                                var n_4 = 0;
                                rows.forEach(function (row) {
                                    embed_6.addField((n_4 += 1) + "#:", "" + row.selfRoles);
                                });
                                message.channel.send(embed_6).then(function () {
                                    message.channel.awaitMessages(function (m) {
                                        return m.author.id == message.author.id;
                                    }, {
                                        errors: ['time'],
                                        max: 1,
                                        time: 30000
                                    }).then(function (response) {
                                        response = response.array()[0].content;
                                        if (response == "exit")
                                            return funcs.send("Command canceled!");
                                        response = parseInt(response);
                                        if (isNaN(response) || response <= 0 || response > rows.length)
                                            return funcs.send("Not a valid number!");
                                        embed_6.fields.forEach(function (f) {
                                            if (f.name.startsWith(response)) {
                                                var rolePicked_3 = f.value;
                                                var finder1 = message.guild.roles.find(function (r) {
                                                    return r.name == rolePicked_3;
                                                });
                                                if (!finder1)
                                                    return funcs.send("Role not found in guild! It may have been deleted!");
                                                if (finder1.position >= message.guild.me.highestRole.position)
                                                    return funcs.send("Role has the same position or a higher position than me!");
                                                con.query("DELETE FROM guildSelfRoles WHERE selfRoles =\"" + rolePicked_3 + "\" AND guildId =\"" + message.guild.id + "\""); //finish
                                                funcs.send("Role successfully removed!");
                                                con.query("UPDATE guildCasenumber SET caseNumber = " + (row.caseNumber + 1) + " WHERE guildId = " + message.guild.id);
                                                if (row.logsEnabled !== "true")
                                                    return;
                                                var finder = message.guild.channels.find(function (c) {
                                                    return c.name == row.logsChannel;
                                                });
                                                if (!finder)
                                                    return;
                                                var embed_7 = new richEmbed()
                                                    .setTitle("Selfrole Removed from Member.")
                                                    .setTimestamp()
                                                    .setAuthor(message.author.username, message.author.avatarURL)
                                                    .setThumbnail(bot.user.avatarURL)
                                                    .setColor(funcs.rc())
                                                    .addField("Role:", rolePicked_3)
                                                    .addField("Removed by:", message.author.username)
                                                    .addField("Removed at", message.createdAt.toDateString())
                                                    .addField("Case number:", "#" + (row.caseNumber + 1))
                                                    .addField("Message:", "[JumpTo](" + message.url + ")");
                                                message.guild.channels.get(finder.id).send(embed_7);
                                            }
                                        });
                                    }).catch((e) => {
                                        funcs.send(`You ran out of time or an error occured!`);
                                        console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                                    });
                                });
                            }
                        }).catch((e) => {
                            funcs.send(`You ran out of time or an error occured!`);
                            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                        });
                    });
                });
            });
        });
    } catch (e) {
        console.error;
        funcs.send("Oh no! An error occurred! `" + e.message + "`.");
    }
    return
};
module.exports.config = {
    name: "selfrole",
    aliases: [],
    usage: "Use this command to manage selfroles.",
    commandCategory: "moderation",
    cooldownTime: '0'
};