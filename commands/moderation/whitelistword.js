const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                const word = args.join(` `);
                if (!word) return funcs.send(`You need to specify a word to whitelist!`, true);
                con.query(`SELECT * FROM guildWords WHERE guildWords.guildId ="${message.guild.id}"`, (e, words) => {
                    const wordsMapped = words.map(w => w.words);
                    if (!wordsMapped.includes(word.toLowerCase())) return funcs.send(`Word is not blacklisted!`, true);
                    con.query(`DELETE FROM guildWords WHERE guildId ="${message.guild.id}" AND words ="${word}"`);
                    funcs.send(`Word successfully whitelisted!`, false);
                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                    if (row.logsEnabled !== "true") return;
                    let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                    if (!finder) return;
                    let embed = new MessageEmbed()
                        .setTitle(`Word Whitelisted.`)
                        .setTimestamp()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setThumbnail(bot.user.avatarURL)
                        .setColor(funcs.rc())
                        .addField(`Word:`, word)
                        .addField(`Whitelisted by:`, message.author.username)
                        .addField(`Whitelisted at`, message.createdAt.toDateString())
                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                        .addField(`Message:`, `[JumpTo](${message.url})`);
                    message.guild.channels.get(finder.id).send(embed);
                });
            });
        });
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "whitelistword",
    aliases: ["wlw"],
    usage: "Use this command to whitelist a word that has been blacklisted.",
    commandCategory: "moderation",
    cooldownTime: '0'
};