const memJoinfuncs = require('./../../assets/handlers/memberjoin.js');
const { dbConnect } = require('./../../assets/handlers/dbConnection.js');

let con;
con = dbConnect();

module.exports = async (bot, member) => {
    con.query(`SELECT gwls.welcomeMessage, gwls.welcomeMessageEnabled, gwls.welcomeChannel, gs.antiJoinEnabled, gs.autoRoleEnabled, gs.twoFAEnabled, gs.twoFAPass, gs.rolePersistEnabled, ge.events FROM guildWLSystem as gwls LEFT JOIN guildSettings as gs ON gs.guildId = gwls.guildId LEFT JOIN guildDisabledSettings as ge ON ge.guildId = gwls.guildId WHERE gwls.guildId ="${member.guild.id}"`, async (e, row) => {
        row = row[0];
        if (member.user.bot) return;
        const guild = member.guild;
        if (row.antiJoinEnabled === "true") {
            member.send(`AntiJoin is enabled in this server! You have been kicked.`).catch(() => { });
            return member.kick('Antijoin Is Enabled!');
        }
        memJoinfuncs.writeUserToDB(guild, member);

        if (row.twoFAEnabled === 'true') {
            memJoinfuncs.server2FA(row, member).then(() => {
                if (row.rolePersistEnabled === "true") {
                    con.query(`SELECT * FROM guildRolePersist WHERE guildId ="${member.guild.id}" AND userId ="${member.id}"`, (e, roles) => {
                        if (roles.length == 0) return;
                        memJoinfuncs.guildRolepersist(roles[0], member);
                    });
                }
                if (row.welcomeMessageEnabled === "true") {
                    memJoinfuncs.guildWelcomeMessage(bot, row, member);
                }
                if (row.autoRoleEnabled === "true") {
                    con.query(`SELECT * FROM guildAutoRole WHERE guildId ="${member.guild.id}"`, (e, roles) => {
                        memJoinfuncs.guildAutorole(roles, member);
                    });
                }
            });
        } else {
            if (row.rolePersistEnabled === "true") {
                con.query(`SELECT * FROM guildRolePersist WHERE guildId ="${member.guild.id}" AND userId ="${member.id}"`, (e, roles) => {
                    memJoinfuncs.guildRolepersist(roles[0], member);
                });
            }
            if (row.welcomeMessageEnabled == "true") {
                memJoinfuncs.guildWelcomeMessage(bot, row, member);
            }
            if (row.autoRoleEnabled == "true") {
                con.query(`SELECT * FROM guildAutoRole WHERE guildId ="${member.guild.id}"`, (e, roles) => {
                    memJoinfuncs.guildAutorole(roles, member);
                });
            }
        }
    });
};