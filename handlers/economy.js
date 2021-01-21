function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const cooldown = new Set();

module.exports = {
    giveCash: (con, message) => {
        //con.query(`CREATE TABLE IF NOT EXISTS guildCash (guildId TEXT, userId TEXT, userCash INTEGER, userBankedCash INTEGER, username TEXT, hasRecievedCash TEXT, hasBeenRobbed TEXT, has_cheated TEXT)`);
        const cashToGive = getRndInteger(50, 200);
        if (cooldown.has(message.author.id) && cooldown.has(message.guild.id)) return;
        con.query(`SELECT * FROM guildCash WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row) => {
            if (e) {
                con.query(`CREATE TABLE IF NOT EXISTS guildCash (guildId TEXT(30), userId TEXT(30), userCash INTEGER(255), userBankedCash INTEGER(255), username TEXT(30), hasRecievedCash TEXT(30), hasBeenRobbed TEXT(30), has_cheated TEXT(30))`, () => {
                    console.log('inserting in guildCash because error')
                    con.query(`INSERT INTO guildCash (guildId, userId, userCash, userBankedCash, username, hasRecievedCash, hasBeenRobbed, has_cheated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, cashToGive, 0, message.author.username, "false", "false", "false"]);
                    if (!cooldown.has(message.guild.id)) cooldown.add(message.guild.id);
                    cooldown.add(message.author.id);
                });
                return;
            }
            if (row !== undefined && row.length !== 0 && row[0].userCash >= 1000000) return;
            if (row !== undefined && row.length !== 0 && cashToGive + row[0].userCash >= 1000000) return con.query(`UPDATE guildCash SET userCash = 1000000 WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
            if (!row || row.length == 0) {
                con.query(`INSERT INTO guildCash (guildId, userId, userCash, userBankedCash, username, hasRecievedCash, hasBeenRobbed, has_cheated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, cashToGive, 0, message.author.username, "false", "false", "false"]);
                if (!cooldown.has(message.guild.id)) cooldown.add(message.guild.id);
                cooldown.add(message.author.id);
            } else if (row.length > 1) {
                con.query(`DELETE FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}" LIMIT 1`);
            } else {
                con.query(`UPDATE guildCash SET userCash = ${row[0].userCash + cashToGive} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                if (!cooldown.has(message.guild.id)) cooldown.add(message.guild.id);
                cooldown.add(message.author.id);
            }
        });
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 60000);
    }
};