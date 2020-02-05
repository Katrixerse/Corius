const { dbConnect } = require('./dbConnection.js');

let con;
con = dbConnect();

module.exports = {
    //removeUserFromDB: () => {
    // May be needed later for now just gonna comment it
    // },
    rolePersist: (roles, member) => {
        if (member.roles.size == 0) return;
        let roles1 = member.roles.filter(r => r.position < member.guild.me.highestRole.position).map(r => r.name).join("¶");
        con.query(`SELECT * FROM guildRolePersist WHERE guildId ="${member.guild.id}" AND userId ="${member.id}"`, (e, row1) => {
            if (row1.length >= 1) {
                con.query(`UPDATE guildRolePersist SET userRoles = "${roles1}" WHERE guildId = ${member.guild.id} AND userId = ${member.id}`);
            } else {
                con.query(`INSERT INTO guildRolePersist (guildId, userId, userRoles) VALUES (?, ?, ?)`, [member.guild.id, member.id, roles1]);
            }
        });
    },
    guildLeaveMessage: (bot, row, member) => {
        let lMessage = row.leaveMessage.replace(/\%NAME\%/g, member.user.username).replace(/\%GUILDNAME\%/g, member.guild.name).replace(/\%MEMBERCOUNT\%/g, member.guild.members.size);
        let lChannel = member.guild.channels.find(c => c.name == row.leaveChannel);
        if (!lChannel) return;
        bot.channels.get(lChannel.id).send(`**__${lMessage}__**`);
    }
};