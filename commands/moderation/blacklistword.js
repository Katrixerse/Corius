const { richEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                row = row[0];
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                const word = args.join(` `);
                if (!word) return funcs.send(`You need to specify a word to blacklist!`, true);
                if (bot.commands.has(word)) return funcs.send(`Word cannot be a command!`);
                con.query(`SELECT * FROM guildWords WHERE guildWords.guildId ="${message.guild.id}"`, (e, words) => {
                    if (words.length >= 20) return funcs.send(`Too many blacklisted words added! (20) Please consider whitelisting some and try again.`);
                    con.query(`INSERT INTO guildWords (guildId, words) VALUES (?, ?)`, [message.guild.id, word.toLowerCase()]);
                    funcs.send(`Word successfully blacklisted!`);
                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                    if (row.logsEnabled !== "true") return;
                    let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                    if (!finder) return;
                    let embed = new richEmbed()
                        .setTitle(`Word Blacklisted.`)
                        .setTimestamp()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setThumbnail(bot.user.avatarURL)
                        .setColor(funcs.rc())
                        .addField(`Word:`, word)
                        .addField(`Blacklisted by:`, message.author.username)
                        .addField(`Blacklisted at`, message.createdAt.toDateString())
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
    name: "blacklistword",
    aliases: ["blw"],
    usage: "Use this command to blacklist a word and delete any message that includes it.",
    commandCategory: "moderation",
    cooldownTime: '0'
};