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
                    funcs.send(`You have not yet repped that user.`);
                } else {
                    rep = rep[0];
                    if (!rep.reppedBy.includes(message.author.id)) return funcs.send(`You have not yet repped that user.`);
                    con.query(`UPDATE guildRep SET rep = ${rep.rep - 1} WHERE guildId ="${message.guild.id}" AND userId ="${whoto.id}"`);
                    con.query(`UPDATE guildRep SET reppedBy = "${rep.reppedBy.split(message.author.id)}" WHERE guildId ="${message.guild.id}" AND userId ="${whoto.id}"`);
                    funcs.send(`You have now unrepped that user. (New rep: ${rep.rep - 1})`);
                }
            });
        });
    } catch (e) {
        console.log(e);
        funcs.send(`An error occurred! Error: ${e.message}`);
    }
};

module.exports.config = {
    name: "unrep",
    aliases: [],
    usage: "Use this command to unrep somebody.",
    commandCategory: "leveling",
    cooldownTime: "0"
};
