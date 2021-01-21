const memLeavefuncs = require('./../../handlers/memberleave.js');
const { dbConnect } = require('./../../handlers/dbConnection.js');

let con;
con = dbConnect();

module.exports = async (bot, member) => {
  con.query(`SELECT gwls.leaveMessageEnabled, gwls.leaveMessage, gwls.leaveChannel, gde.events, gs.rolePersistEnabled FROM guildWLSystem as gwls LEFT JOIN guildDisabledSettings as gde ON gde.guildId = gwls.guildId LEFT JOIN guildSettings as gs ON gs.guildId = gwls.guildId WHERE gwls.guildId ="${member.guild.id}"`, (e, row) => {
    row = row[0];
    if (row.rolePersistEnabled === 'true') {
      con.query(`SELECT * FROM guildRolePersist WHERE guildId ="${member.guild.id}" AND userId ="${member.id}"`, (e, roles) => {
        memLeavefuncs.rolePersist(roles, member);
      });
    }
    if (row.leaveMessageEnabled === 'true') {
      memLeavefuncs.guildLeaveMessage(bot, row, member);
    }
  });
};