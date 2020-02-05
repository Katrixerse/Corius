module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT gc.caseNumber, gs.logsEnabled, gs.logsChannel, gam.antiInvites, gam.antiWebsites, gam.antiCapslock, gam.antiAscii, gam.antiDuplicates, gam.antiPing, gam.ignoreChannels, gam.IgnoreRoles, gam.warnOnAutoMod FROM guildCasenumber AS gc LEFT JOIN guildSettings AS gs ON gs.guildId = gc.guildId LEFT JOIN guildAutoModeration AS gam ON gam.guildId = gc.guildId WHERE gc.guildId ="${message.guild.id}"`, async (e, row) => {
        row = row[0];
        con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
            try {
                let row1 = rows.map(r => r.mod);
                const permissionNeeded = "ADMINISTRATOR";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You don't have the ${permissionNeeded} permission to use this command., true`);
                message.channel.send(`***What would you like to do?***\n\`\`\`Manage anti-invites (say 1)\nManage anti-weblinks (say 2)\nManage anti-capslock (say 3)\nManage anti-ascii Warning: includes emotes (say 4)\nManage anti-duplicates (say 5)\nManage Anti-ping (say 6)\nManage Anti-selfbot (say 7)\nManage all automods (say 8)\n\nOther Features:\nManage Warn on automod (say 9)\nManage channels for automod to ignore (say 10)\nManage roles for automod to ignore (comming soon)(say 11)\n\n\nType exit to cancel.\`\`\``)
                    .then(() => {
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        })
                            .then((resp) => {
                                if (!resp) return;
                                resp = resp.array()[0];
                                if (resp.content == "1") {
                                    if (row.antiInvites === 'false') {
                                        message.channel.send(`**__Anti-invites is already disabled would you like to enable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiInvites = "true" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-invites have now been enabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    } else {
                                        message.channel.send(`**__Anti-invites is already enabled would you like to disable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiInvites = "false" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-invites have now been disabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    }
                                } else if (resp.content.toLowerCase() == "2") {
                                    if (row.antiWebsites === 'false') {
                                        message.channel.send(`**__Anti-websites is already disabled would you like to enable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiWebsites = "true" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-websites have now been enabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    } else {
                                        message.channel.send(`**__Anti-websites is already enabled would you like to disable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiWebsites = "false" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-websites have now been disabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    }
                                } else if (resp.content.toLowerCase().includes("3")) {
                                    if (row.antiCapslock === 'false') {
                                        message.channel.send(`**__Anti-capslock is already disabled would you like to enable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiCapslock = "true" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-capslock have now been enabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    } else {
                                        message.channel.send(`**__Anti-capslock is already enabled would you like to disable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiCapslock = "false" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-capslock have now been disabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    }
                                } else if (resp.content.toLowerCase().includes("4")) {
                                    if (row.antiAscii === 'false') {
                                        message.channel.send(`**__Anti-ascii is already disabled would you like to enable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiAscii = "true" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-ascii have now been enabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    } else {
                                        message.channel.send(`**__Anti-ascii is already enabled would you like to disable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiAscii = "false" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-ascii have now been disabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    }
                                } else if (resp.content.toLowerCase().includes("5")) {
                                    if (row.antiDuplicates === 'false') {
                                        message.channel.send(`**__Anti-duplicates is already disabled would you like to enable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiDuplicates = "true" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-duplicates have now been enabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    } else {
                                        message.channel.send(`**__Anti-duplicates is already enabled would you like to disable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiDuplicates = "false" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-duplicates have now been disabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    }).catch((err) => {
                                                        if (err.message === undefined) {
                                                            funcs.send('You provided no input in the time limit, please try again.');
                                                        } else {
                                                            console.log(err);
                                                            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                        }
                                                    });
                                            }).catch((err) => {
                                                if (err.message === undefined) {
                                                    funcs.send('You provided no input in the time limit, please try again.');
                                                } else {
                                                    console.log(err);
                                                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                }
                                            });
                                    }
                                } else if (resp.content.toLowerCase().includes("6")) {
                                    if (row.antiPing === 'false') {
                                        message.channel.send(`**__Anti-pings is already disabled would you like to enable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiPing = "true" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-ping have now been enabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    });
                                            });
                                    } else {
                                        message.channel.send(`**__Anti-ping is already enabled would you like to disable it?__**`)
                                            .then(() => {
                                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ['time'],
                                                })
                                                    .then((resp) => {
                                                        if (!resp) return;
                                                        resp = resp.array()[0];
                                                        if (resp.content.toLowerCase().includes("yes")) {
                                                            con.query(`UPDATE guildAutoModeration SET antiPing = "false" WHERE guildId ="${message.guild.id}"`);
                                                            funcs.send(`Anti-ping have now been disabled.`);
                                                        } else {
                                                            funcs.send('Did not respond with yes command has been cancelled.');
                                                        }
                                                    }).catch((err) => {
                                                        if (err.message === undefined) {
                                                            funcs.send('You provided no input in the time limit, please try again.');
                                                        } else {
                                                            console.log(err);
                                                            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                        }
                                                    });
                                            }).catch((err) => {
                                                if (err.message === undefined) {
                                                    funcs.send('You provided no input in the time limit, please try again.');
                                                } else {
                                                    console.log(err);
                                                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                }
                                            });
                                        }
                                    } else if (resp.content.toLowerCase().includes("7")) {
                                        if (row.antiSelfBot === 'false') {
                                            message.channel.send(`**__Anti-selfbot is already disabled would you like to enable it?__**`)
                                                .then(() => {
                                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                        max: 1,
                                                        time: 30000,
                                                        errors: ['time'],
                                                    })
                                                        .then((resp) => {
                                                            if (!resp) return;
                                                            resp = resp.array()[0];
                                                            if (resp.content.toLowerCase().includes("yes")) {
                                                                con.query(`UPDATE guildAutoModeration SET antiSelfBot = "true" WHERE guildId ="${message.guild.id}"`);
                                                                funcs.send(`Anti-selfbot have now been enabled.`);
                                                            } else {
                                                                funcs.send('Did not respond with yes command has been cancelled.');
                                                            }
                                                        });
                                                });
                                        } else {
                                            message.channel.send(`**__Anti-selfbot is already enabled would you like to disable it?__**`)
                                                .then(() => {
                                                    message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                        max: 1,
                                                        time: 30000,
                                                        errors: ['time'],
                                                    })
                                                        .then((resp) => {
                                                            if (!resp) return;
                                                            resp = resp.array()[0];
                                                            if (resp.content.toLowerCase().includes("yes")) {
                                                                con.query(`UPDATE guildAutoModeration SET antiSelfBot = "false" WHERE guildId ="${message.guild.id}"`);
                                                                funcs.send(`Anti-selfbot have now been disabled.`);
                                                            } else {
                                                                funcs.send('Did not respond with yes command has been cancelled.');
                                                            }
                                                        }).catch((err) => {
                                                            if (err.message === undefined) {
                                                                funcs.send('You provided no input in the time limit, please try again.');
                                                            } else {
                                                                console.log(err);
                                                                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                            }
                                                        });
                                                }).catch((err) => {
                                                    if (err.message === undefined) {
                                                        funcs.send('You provided no input in the time limit, please try again.');
                                                    } else {
                                                        console.log(err);
                                                        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                    }
                                                });
                                            }
                                        } else if (resp.content.toLowerCase().includes("8")) {
                                                message.channel.send(`**__Would you like to enable or disable all automod features?__**`)
                                                    .then(() => {
                                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                            max: 1,
                                                            time: 30000,
                                                            errors: ['time'],
                                                        })
                                                            .then((resp) => {
                                                                if (!resp) return;
                                                                resp = resp.array()[0];
                                                                if (resp.content.toLowerCase().includes("enable")) {
                                                                    con.query(`UPDATE guildAutoModeration SET antiInvites = "true", antiWebsites = "true", antiCapslock = "true", antiAscii = "true", antiDuplicates = "true", antiPing = "true", antiSelfBot = "true"  WHERE guildId ="${message.guild.id}"`);
                                                                    funcs.send(`All automod features have now been enabled.`);
                                                                } else if (resp.content.toLowerCase().includes("disable")) {
                                                                    con.query(`UPDATE guildAutoModeration SET antiInvites = "false", antiWebsites = "false", antiCapslock = "false", antiAscii = "false", antiDuplicates = "false", antiPing = "false", antiSelfBot = "false"  WHERE guildId ="${message.guild.id}"`);
                                                                    funcs.send(`All automod features have now been disabled.`);
                                                                } else {
                                                                    funcs.send('Did not respond with yes command has been cancelled.');
                                                                }
                                                            });
                                                    });
                                            } else if (resp.content.toLowerCase().includes("9")) {
                                                if (row.warnOnAutoMod === 'false') {
                                                    message.channel.send(`**__Warn on automod is already disabled would you like to enable it?__**`)
                                                        .then(() => {
                                                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                                max: 1,
                                                                time: 30000,
                                                                errors: ['time'],
                                                            })
                                                                .then((resp) => {
                                                                    if (!resp) return;
                                                                    resp = resp.array()[0];
                                                                    if (resp.content.toLowerCase().includes("yes")) {
                                                                        con.query(`UPDATE guildAutoModeration SET warnOnAutoMod = "true" WHERE guildId ="${message.guild.id}"`);
                                                                        funcs.send(`Warn on automod has now been enabled.`);
                                                                    } else {
                                                                        funcs.send('Did not respond with yes command has been cancelled.');
                                                                    }
                                                                });
                                                        });
                                                } else {
                                                    message.channel.send(`**__Warn on automod is already enabled would you like to disable it?__**`)
                                                        .then(() => {
                                                            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                                max: 1,
                                                                time: 30000,
                                                                errors: ['time'],
                                                            })
                                                                .then((resp) => {
                                                                    if (!resp) return;
                                                                    resp = resp.array()[0];
                                                                    if (resp.content.toLowerCase().includes("yes")) {
                                                                        con.query(`UPDATE guildAutoModeration SET warnOnAutoMod = "false" WHERE guildId ="${message.guild.id}"`);
                                                                        funcs.send(`Warn on automod has now been disabled.`);
                                                                    } else {
                                                                        funcs.send('Did not respond with yes command has been cancelled.');
                                                                    }
                                                                }).catch((err) => {
                                                                    if (err.message === undefined) {
                                                                        funcs.send('You provided no input in the time limit, please try again.');
                                                                    } else {
                                                                        console.log(err);
                                                                        return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                                    }
                                                                });
                                                        }).catch((err) => {
                                                            if (err.message === undefined) {
                                                                funcs.send('You provided no input in the time limit, please try again.');
                                                            } else {
                                                                console.log(err);
                                                                return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                                            }
                                                        });
                                                    }
                                                } else if (resp.content.toLowerCase().includes("10")) {
                                                    message.channel.send(`**__Would you like to add or remove a channel?__**`)
                                                    .then(() => {
                                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                            max: 1,
                                                            time: 30000,
                                                            errors: ['time'],
                                                        })
                                                            .then((resp) => {
                                                                if (!resp) return;
                                                                resp = resp.array()[0];
                                                                if (resp.content.toLowerCase().includes("add")) {
                                                                    message.channel.send(`**__What channel would you like to add?__**`)
                                                                    .then(() => {
                                                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                                            max: 1,
                                                                            time: 30000,
                                                                            errors: ['time'],
                                                                        })
                                                                            .then((resp) => {
                                                                                if (!resp) return;
                                                                                resp = resp.array()[0];
                                                                                let f = message.guild.channels.find(c => c.name.toLowerCase() == resp.content.toLowerCase());
                                                                                if (!f) return message.channel.send(`I couldn't find the channel "${resp.content}" make sure you spelled it correctly and try again.`)
                                                                                con.query(`UPDATE guildAutoModeration SET ignoreChannels = "${row.ignoreChannels}, ${resp.content}" WHERE guildId ="${message.guild.id}"`);
                                                                                funcs.send(`The channel has been added to the automod ignore list.`);
                                                                            })
                                                                        })
                                                                } else if (resp.content.toLowerCase().includes("remove")) {
                                                                    message.channel.send(`**__What channel would you like to remove?__**`)
                                                                    .then(() => {
                                                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                                            max: 1,
                                                                            time: 30000,
                                                                            errors: ['time'],
                                                                        })
                                                                            .then((resp) => {
                                                                                if (!resp) return;
                                                                                resp = resp.array()[0];
                                                                                let f = message.guild.channels.find(c => c.name.toLowerCase() == resp.content.toLowerCase());
                                                                                if (!f) return message.channel.send(`I couldn't find the channel "${resp.content}" make sure you spelled it correctly and try again.`)
                                                                                let removeChannel = row.ignoreChannels.replace(resp.content, '')
                                                                                con.query(`UPDATE guildAutoModeration SET ignoreChannels = "${removeChannel}" WHERE guildId ="${message.guild.id}"`);
                                                                                funcs.send(`The channel has been removed to the automod ignore list.`);
                                                                            })
                                                                        })
                                                                } else {
                                                                    funcs.send('Did not respond with add or remove command has been cancelled.');
                                                                }
                                                            });
                                                    });
                                                } else if (resp.content.toLowerCase().includes("11")) {
                                                    message.channel.send(`**__Would you like to add or remove a role?__**`)
                                                    .then(() => {
                                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                            max: 1,
                                                            time: 30000,
                                                            errors: ['time'],
                                                        })
                                                            .then((resp) => {
                                                                if (!resp) return;
                                                                resp = resp.array()[0];
                                                                if (resp.content.toLowerCase().includes("add")) {
                                                                    message.channel.send(`**__What role would you like to add?__**`)
                                                                    .then(() => {
                                                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                                            max: 1,
                                                                            time: 30000,
                                                                            errors: ['time'],
                                                                        })
                                                                            .then((resp) => {
                                                                                if (!resp) return;
                                                                                resp = resp.array()[0];
                                                                                const f = message.guild.roles.find(r => r.name.toLowerCase() == resp.content.toLowerCase());
                                                                                if (!f) return message.channel.send(`I couldn't find the channel "${resp.content}" make sure you spelled it correctly and try again.`)
                                                                                con.query(`UPDATE guildAutoModeration SET ignoreRoles = "${row.ignoreRoles}, ${resp.content}" WHERE guildId ="${message.guild.id}"`);
                                                                                funcs.send(`The role has been added to the automod ignore list.`);
                                                                            })
                                                                        })
                                                                } else if (resp.content.toLowerCase().includes("remove")) {
                                                                    message.channel.send(`**__What role would you like to remove?__**`)
                                                                    .then(() => {
                                                                        message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                                                            max: 1,
                                                                            time: 30000,
                                                                            errors: ['time'],
                                                                        })
                                                                            .then((resp) => {
                                                                                if (!resp) return;
                                                                                resp = resp.array()[0];
                                                                                const f = message.guild.roles.find(r => r.name.toLowerCase() == resp.content.toLowerCase());
                                                                                if (!f) return message.channel.send(`I couldn't find the channel "${resp.content}" make sure you spelled it correctly and try again.`)
                                                                                let removeChannel = row.ignoreRoles.replace(resp.content, '')
                                                                                con.query(`UPDATE guildAutoModeration SET ignoreRoles = "${removeChannel}" WHERE guildId ="${message.guild.id}"`);
                                                                                funcs.send(`The role has been removed to the automod ignore list.`);
                                                                            })
                                                                        })
                                                                } else {
                                                                    funcs.send('Did not respond with add or remove command has been cancelled.');
                                                                }
                                                            });
                                                    });
                                } else if (resp.content.toLowerCase().includes("exit")) {
                                    funcs.send('Command has been cancelled.');
                                } else {
                                    funcs.send('Command has been cancelled.');
                                }
                            }).catch((err) => {
                                if (err.message === undefined) {
                                    funcs.send('You provided no input in the time limit, please try again.');
                                } else {
                                    console.log(err);
                                    return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                                }
                            });
                    }).catch((err) => {
                        if (err.message === undefined) {
                            funcs.send('You provided no input in the time limit, please try again.');
                        } else {
                            console.log(err);
                            return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
                        }
                    });
            } catch (e) {
                console.log(e)
            }
        });
    })
};

module.exports.config = {
    name: "manageautomod",
    aliases: ["mam"],
    usage: "Command helps you manage auto moderation features.",
    commandCategory: "miscellaneous",
    cooldownTime: "5"
};