module.exports.run = (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT * FROM guildSettings WHERE guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            if (row.levelingEnabled == "disabled") return;
            const whoto = message.mentions.members.first();
            if (!whoto) return funcs.send(`You did not mention anybody to rep!`);
            if (whoto.id == message.author.id || whoto.user.bot) return funcs.send(`Not a valid user to rep.`);
            con.query(`SELECT * FROM guildRep WHERE guildId ="${message.guild.id}" AND userId ="${whoto.id}"`, (e, rep) => {
                if (rep.length == 0) {
                    con.query(`INSERT INTO guildRep (guildId, userId, rep, reppedBy) VALUES (?, ?, ?, ?)`, [message.guild.id, whoto.id, 1, message.author.id]);
                    funcs.send(`You have now repped that user. (New rep: 1)`);
                } else {
                    rep = rep[0];
                    if (rep.reppedBy.includes(message.author.id)) return funcs.send(`You have already repped that user once.`);
                    if (rep.rep >= 100) return funcs.send(`Maximum rep exceeded (100). User has not been repped.`);
                    con.query(`UPDATE guildRep SET rep = ${rep.rep + 1} WHERE guildId ="${message.guild.id}" AND userId ="${whoto.id}"`);
                    con.query(`UPDATE guildRep SET reppedBy = "${rep.reppedBy + "," + message.author.id}" WHERE guildId ="${message.guild.id}" AND userId ="${whoto.id}"`);
                    funcs.send(`You have now repped that user. (New rep: ${rep.rep + 1})`);
                }
            });
        });
    } catch (e) {
        console.log(e);
        funcs.send(`An error occurred! Error: ${e.message}`);
    }
};

module.exports.config = {
    name: "rep",
    aliases: [],
    usage: "Use this command to rep somebody.",
    commandCategory: "leveling",
    cooldownTime: "0"
};
