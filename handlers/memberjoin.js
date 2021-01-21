const { dbConnect } = require('./dbConnection.js');

let con;
con = dbConnect();

module.exports = {
    writeUserToDB: (member, guild) => {
        con.query(`SELECT * FROM guildLeveling WHERE guildId ="${guild.id}" AND userId ="${member.id}"`, (e, row) => {
            if (!row || row.length == 0) {
                con.query(`INSERT INTO guildLeveling (guildId, userId, userPrestige, userLevel, userXP, hasRecievedXP, username, userRank) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [guild.id, member.id, 0, 1, 1, "false", member.username, "Member"]);
            }
        });
        con.query(`SELECT * FROM guildCash WHERE guildId ="${guild.id}" AND userId ="${member.id}"`, (e, row) => {
            if (!row || row.length == 0) {
                con.query(`INSERT INTO guildCash (guildId, userId, userCash, userBankedCash, username, hasRecievedCash, hasBeenRobbed, has_cheated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [guild.id, member.id, 1, 0, member.username, "false", "no", "false"]);
            }
        });
    },
    server2FA: async (row, member) => {
        const password = row.twoFAPass;
        member.guild.channels.forEach(async channel => {
            await channel.overwritePermissions(member, {
                'SEND_MESSAGES': false
            }).catch((e) => { console.log(e) });
        });
        await member.createDM().then(async channel => {
            await channel.send(`__**2-factor Server Security is enabled on this server. Please enter the password shown to proceed: ${password}.**__`).then(async () => {
                await channel.awaitMessages(m => m.author.id === member.id, {
                    max: 1,
                    errors: ["time"],
                    time: 30000
                }).then((response) => {
                    response = response.array()[0].content;
                    if (response === password) {
                        channel.send(`__**Correct password entered. You may proceed to the server!**__`);
                        member.guild.channels.forEach(async channel => {
                            await channel.overwritePermissions(member, {
                                'SEND_MESSAGES': true
                            }).catch(() => { });
                        });
                    } else {
                        channel.send(`**__Wrong password entered. You have been kicked.__**`);
                        member.kick(`Wrong password in TFSS.`);
                        member.guild.channels.forEach(async channel => {
                            await channel.overwritePermissions(member, {
                                'SEND_MESSAGES': true
                            }).catch(() => { });
                        });
                    }
                }).catch((e) => {
                    channel.send(`**__You ran out of time or an error occured!__**`);
                    member.kick(`Ran out of time in TFSS.`);
                    console.log(`Error: ${e.message} in guild ${member.guild.name} memberjoin`);
                });
            });
        });
    },
    guildAutorole: (roles, member) => {
        if (!roles || roles.length == 0) return;
        roles.forEach(role => {
            const actualRole = role.roles;
            const finder = member.guild.roles.find(r => r.name == actualRole);
            if (!finder) return;
            if (finder.position >= member.guild.me.highestRole.position) return;
            member.addRole(finder);
        });
    },
    guildRolepersist: (row, member) => {
        const actualRoles = row.userRoles.split("¶");
        actualRoles.forEach(role => {
            const check = member.guild.roles.find(r => r.name == role);
            if (!check) return;
            if (check.position >= member.guild.me.highestRole.position) return;
            member.addRole(check, `Role persist`).catch(() => { });
        });
    },
    guildWelcomeMessage: (bot, row, member /* hi I did role persist we did a lot today you should test it if you want good luck with whatever youre gonna do next - andrew */) => {
        let wMessage = row.welcomeMessage.replace(/\%NAME\%/g, member.user.username).replace(/\%PING\%/g, member).replace(/\%GUILDNAME\%/g, member.guild.name).replace(/\%MEMBERCOUNT\%/g, member.guild.members.size);
        let wChannel = member.guild.channels.find(c => c.name == row.welcomeChannel);
        if (!wChannel) return;
        bot.channels.get(wChannel.id).send(`**__${wMessage}__**`);
    }
};