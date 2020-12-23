const { MessageEmbed } = require("discord.js");
module.exports.run = (bot, message, args, funcs, con) => {
    const permissionNeeded = `MANAGE_GUILD`;
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
        let row1 = rows.map(r => r.guildMods);
        if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You are missing the ${permissionNeeded} permission to use this command!`, true);
        const user = message.mentions.members.first();
        if (!user) return funcs.send(`You did not mention a user to display their warns!`);
        const embed = new MessageEmbed()
            .setTitle(`${user.user.username}'s warns`)
            .setColor(funcs.rc())
            .setThumbnail(user.user.avatarURL);
        con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${user.id}"`, (e, rows) => {
            let n = 0;
            if (!rows || rows.length == 0) return funcs.send(`User has no warns.`, true);
            rows.forEach(row => {
                embed.addField(`#${n += 1}:`, `Warning reason: ${row.warning}\nWarned by: ${row.warnedBy}\nWarned at: ${row.warnedAt}`);
            });
            embed.setDescription(`Current warn count: ${rows.length}`);
            message.channel.send(embed);
        });
    });
};

module.exports.config = {
    name: "warns",
    aliases: [],
    usage: "Displays the warnings a user.",
    commandCategory: "moderation",
    cooldownTime: '0'
};