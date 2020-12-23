const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "KICK_MEMBERS";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                let pollText = args.join(` `);
                if (!pollText) return funcs.send(`You did not specify any text to put into your poll!`);
                pollText = pollText.substr(0, 1000);
                const embed = new richEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setColor(funcs.rc())
                    .setFooter(bot.user.username)
                    .setTitle(`Poll Started!`)
                    .setDescription(pollText)
                    .addField(`Started by:`, message.author.tag)
                    .setThumbnail(message.author.avatarURL);
                message.channel.send(embed).then(m => {
                    m.react("✅");
                    m.react("🤷");
                    m.react("❌");
                }).catch(() => { });
                message.delete().catch(() => { });
            });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "poll",
    aliases: [],
    usage: "Use this command to create a poll.",
    commandCategory: "moderation",
    cooldownTime: '5'
};