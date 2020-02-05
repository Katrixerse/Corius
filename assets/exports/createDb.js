const { dbConnect } = require('./../handlers/dbConnection.js');

let con;
con = dbConnect();

module.exports = {
    createDb: () => {
        con.query(`CREATE TABLE IF NOT EXISTS guildPrefix (guildId TEXT(30), prefix TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildSettings (guildId TEXT(30), logsEnabled TEXT(30), logsChannel TEXT(30), clogsEnabled TEXT(30), clogsChannel TEXT(30), antiJoinEnabled TEXT(30), levelingEnabled TEXT(30), economyEnabled TEXT(30), muteRole TEXT(30), wordWhitelistEnabled TEXT(30), twoFAEnabled TEXT(30), twoFAPass TEXT(30), rolePersistEnabled TEXT(30), afkEnabled TEXT(30), modOnly TEXT(30), autoRoleEnabled TEXT(30), levelingDisplayMode TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildDisabledSettings (guildId TEXT(30), commands TEXT(255), categories TEXT(255), channels TEXT(255), events TEXT(255))`);
        con.query(`CREATE TABLE IF NOT EXISTS punishments (guildId TEXT(30), reason TEXT(30), punishCount TEXT(30), action TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildCasenumber (guildId TEXT(30), caseNumber INTEGER(30))`);
        // con.query(`CREATE TABLE IF NOT EXISTS guildList (guildId TEXT, user TEXT, username, TEXT)`);
        con.query(`CREATE TABLE IF NOT EXISTS guildWords (guildId TEXT(30), words TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS userPunishments (guildId TEXT(30), userId TEXT(30), warnings INTEGER(255), kicks INTEGER(255), mutes INTEGER(255), bans INTEGER(255), reports INTEGER(255))`);
        con.query(`CREATE TABLE IF NOT EXISTS userNotes (guildId TEXT(30), userId TEXT(30), note TEXT(500), addedAt TEXT(50))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildAutoRole (guildId TEXT(30), roles TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildSelfRole (guildId TEXT(30), selfRoles TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildAutoModeration (guildId TEXT(30), antiWebsites TEXT(30), antiInvites TEXT(30), antiAscii TEXT(30), antiCapslock TEXT(30), antiDuplicates TEXT(30), antiPing TEXT(30), antiSelfBot TEXT(30), ignoreChannels TEXT(30), IgnoreRoles TEXT(30), warnOnAutoMod TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildLeveling (guildId TEXT(30), userId TEXT(30), userLevel INTEGER(255), userXP INTEGER(255), hasRecievedXP TEXT(30), username TEXT(30), userRank TEXT(30), userPrestige INTEGER(20))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildRep (guildId TEXT(30), userId TEXT(30), rep INTEGER(255), reppedBy TEXT(255))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildCash (guildId TEXT(30), userId TEXT(30), userCash INTEGER(255), userBankedCash INTEGER(255), username TEXT(255), hasRecievedCash TEXT(30), hasBeenRobbed TEXT(30), has_cheated TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildGiveaways (guildId TEXT(30), giveawayName TEXT(30), giveawayTime INTEGER(255), giveawayRunning BOOL, timeId TEXT(30), winnerCount INTEGER(255))`);
        con.query(`CREATE TABLE IF NOT EXISTS disabledCommandsInChannels (guildId TEXT(30), channel TEXT(30), command TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildModerators (guildId TEXT(30), guildMods TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildDisabledCreations (guildId TEXT(30), channelsEnabled TEXT(30), rolesEnabled TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS afk (guildId TEXT(30), userId TEXT(30), isAfk BOOL, afkReason TEXT(500))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildBlacklistedUsers (guildId TEXT(30), user TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildCustomCommands (guildId TEXT(30), command_name TEXT(30), command_output TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildCustomResponses (guildId TEXT(30), response_name TEXT(30), response_output TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildRolePersist (guildId TEXT(30), userId TEXT(30), userRoles TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildWLSystem (guildId TEXT(30), welcomeMessageEnabled TEXT(30), welcomeMessage TEXT(30), welcomeChannel TEXT(30), leaveMessageEnabled TEXT(30), leaveMessage TEXT(30), leaveChannel TEXT(30))`);
        //con.query(`CREATE TABLE IF NOT EXISTS guildTeamRoles ()`); //for andrew to fill wow thanks
        con.query(`CREATE TABLE IF NOT EXISTS guildStarBoard (guildId TEXT(30), starBoardEnabled TEXT(30), starBoardChannel TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS userWarns (guildId TEXT(30), userId TEXT(30), warning TEXT(500), warnedAt TEXT, warnedBy TEXT(50), username TEXT(50), warnCount INTEGER(255))`);
        con.query(`CREATE TABLE IF NOT EXISTS userSettings (guildId TEXT(30), userId TEXT(30), dmnsEnabled TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS globalLeveling (userId TEXT(30), userPrestige INTEGER(255), userLevel INTEGER(255), userXP INTEGER(255), hasRecievedXP TEXT(255), username TEXT(30), userRank TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS botBugs (userId TEXT(30), bugMessage TEXT(255), bugReplied TEXT(30), bugId TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS botBugsBlacklisted (guildId TEXT(30), userId TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildModMail (guildId TEXT(30), channel TEXT(30), mode TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildMuteResume (guildId TEXT(30), userId TEXT(30), actualtime TEXT(30), time TEXT(30), muterole TEXT(30), channel TEXT(30))`);
        con.query(`CREATE TABLE IF NOT EXISTS guildReactionRole (guildId TEXT(30), emojiId TEXT(30), roleName TEXT(30))`);
    }
};