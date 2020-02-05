const { dbConnect } = require('./../handlers/dbConnection.js');

let con;
con = dbConnect();

module.exports = {
    addDbEntry: (guildId) => {
        con.query(`SELECT * FROM guildPrefix WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildPrefix (guildId, prefix) VALUES (?, ?)`, [guildId, "c!"]);
            }
        });
        con.query(`SELECT * FROM guildSettings WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildSettings (guildId, logsEnabled, logsChannel, clogsEnabled, clogsChannel, antiJoinEnabled, levelingEnabled, economyEnabled, muteRole, wordWhitelistEnabled, twoFAEnabled, twoFAPass, rolePersistEnabled, afkEnabled, modOnly, autoRoleEnabled, levelingDisplayMode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?)`, [guildId, "true", "mod-logs", 'false', 'chat-logs', 'false', 'false', 'false', 'Muted', 'false', 'false', '1234', 'false', 'false', 'false', 'false', 'text']);
            }
        });
        con.query(`SELECT * FROM guildDisabledSettings WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildDisabledSettings (guildId, commands, categories, channels, events) VALUES (?, ?, ?, ?, ?)`, [guildId, "none", "none", "none", "none"]);
            }
        });
        con.query(`SELECT * FROM guildCasenumber WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildCasenumber (guildId, caseNumber) VALUES (?, ?)`, [guildId, 0]);
            }
        });
        con.query(`SELECT * FROM guildAutoRole WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildAutoRole (guildId, roles) VALUES (?, ?)`, [guildId, "none"]);
            }
        });
        con.query(`SELECT * FROM guildWLSystem WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildWLSystem (guildId, welcomeMessageEnabled, welcomeMessage, welcomeChannel, leaveMessageEnabled, leaveMessage, leaveChannel) VALUES (?, ?, ?, ?, ?, ?, ?)`, [guildId, "false", "Hello %NAME%. Welcome to %GUILDNAME%.", "welcome-leaves", "false", "Goodbye %NAME%. %NAME% left the guild.", "welcome-leaves"]);
            }
        });
        con.query(`SELECT * FROM guildStarBoard WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildStarBoard (guildId, starBoardEnabled, starBoardChannel) VALUES (?, ?, ?)`, [guildId, "false", "starboard"]);
            }
        });
        con.query(`SELECT * FROM guildDisabledCreations WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildDisabledCreations (guildId, channelsEnabled, rolesEnabled) VALUES (?, ?, ?)`, [guildId, "true", "true"]);
            }
        });
        con.query(`SELECT * FROM guildModMail WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildModMail (guildId, channel, mode) VALUES (?, ?, ?)`, [guildId, "modmail", "channel"]);
            }
        });
        con.query(`SELECT * FROM guildAutoModeration WHERE guildId ="${guildId}"`, (e, row) => {
            if (row.length == 0) {
                con.query(`INSERT INTO guildAutoModeration (guildId, antiWebsites, antiInvites, antiAscii, antiCapslock, antiDuplicates, antiPing, antiSelfBot, ignoreChannels, IgnoreRoles, warnOnAutoMod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [guildId, "false", "false", "false", "false", "false", "false", "false", "none", "none", "false"]);
            }
        });
    },
    addDbEntryUserId: (guildId, userId, action) => {
        const muteCount = action == 'mute' ? 1 : 0;
        const warnCount = action == 'warn' ? 1 : 0;
        const kickCount = action == 'kick' ? 1 : 0;
        const banCount = action == 'ban' ? 1 : 0;
        const reportCount = action == 'report' ? 1 : 0;
        con.query(`SELECT * FROM userPunishments WHERE guildId ="${guildId}" AND userId ="${userId}"`, (e, row) => {
            if (!row || row.length == 0) {
                con.query(`INSERT INTO userPunishments(guildId, userId, warnings, kicks, mutes, bans, reports) VALUES (?, ?, ?, ?, ?, ?, ?)`, [guildId, userId, warnCount, kickCount, muteCount, banCount, reportCount]);
                //con.query(`INSERT INTO userPunishments (guildId, userId, warnings, kicks, mutes, bans, reports) VALUES (?, ?, ?, ?, ?, ?, ?)`, [guildId, userId, warnCount, kickCount, muteCount, banCount, reportCount]);
            }
        });
    }
};