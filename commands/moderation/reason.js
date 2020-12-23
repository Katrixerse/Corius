const { MessageEmbed } = require('discord.js');
async function embedSan(embed) {
    embed.message ? delete embed.message : null;
    embed.footer ? delete embed.footer.embed : null;
    embed.provider ? delete embed.provider.embed : null;
    embed.thumbnail ? delete embed.thumbnail.embed : null;
    embed.image ? delete embed.image.embed : null;
    embed.author ? delete embed.author.embed : null;
    embed.fields ? embed.fields.forEach(f => { delete f.embed; }) : null;
    return embed;
}

module.exports.run = async (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gp.prefix, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildPrefix AS gp ON cn.guildId = gp.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, async (e, rows) => {
                row = row[0];
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                let casenumber = args[0];
                if (!casenumber) return funcs.send(`You provided no casenumber, how can I edit the reason?`);
                let reason = args.slice(1).join(` `);
                if (!reason) return funcs.send(`No new reason specified!`);
                if (row.logsEnabled !== "true") return funcs.send(`Modlogs are disabled!`);
                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                if (!finder) return funcs.send(`Could not find logs channel!`);
                finder.fetchMessages({ limit: 100 }).then(async messages => {
                    if (!messages || messages.size == 0) return funcs.send(`No messages found in that channel!`);
                    const logmes = messages.filter(m => m.author.id == bot.user.id &&
                        m.embeds[0] &&
                        m.embeds[0].type === 'rich' &&
                        m.embeds[0].fields &&
                        m.embeds[0].fields.length > 0 &&
                        //m.embeds[0].fields.find(f => f.name.includes("Case number:")).length > 0 //&&
                        m.embeds[0].fields.filter(f => f.name.includes(`Reason`)) &&
                        m.embeds[0].fields.filter(f => f.name.includes(`Reason`)).length > 0 &&
                        m.embeds[0].fields.filter(f => f.value == `#${casenumber}`).length > 0
                    ).first();
                    //console.log(logmes.first())
                    if (!logmes || logmes.size == 0) return funcs.send(`No messages found!`);
                    let em = logmes.embeds[0];
                    const title = em.title ? em.title : null;
                    const description = em.description ? em.description : null;
                    const footer = em.footer ? em.footer.text : null;
                    const author = em.author ? em.author.name : null;
                    const authorurl = em.author ? em.author.icon_url || em.author.url : null;
                    const thumbnail = em.thumbnail ? em.thumbnail.url : null;
                    const image = em.image ? em.image.url : null;
                    const color = em.color ? em.color : null;
                    const newem = new MessageEmbed();
                    if (title)
                        newem.setTitle(title)
                    if (description)
                        newem.setDescription(description)
                    if (author)
                        newem.setAuthor(author, authorurl)
                    if (image)
                        newem.setImage(image)
                    if (thumbnail)
                        newem.setThumbnail(thumbnail)
                    if (footer)
                        newem.setFooter(footer)
                    if (color)
                        newem.setColor(color);
                    logmes.embeds[0].fields.forEach(f => {
                        if (f.name.includes(`Reason`)) {
                            return newem.addField(f.name, reason);
                        }
                        return newem.addField(f.name, f.value);
                    });
                    logmes.edit(newem).catch(e => funcs.send(`Error while editing message: ${e.message}`));
                    funcs.send(`Reason successfully updated!`);
                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setColor(funcs.rc())
                        .setFooter(bot.user.username)
                        .setTitle(`Reason edited`)
                        .addField(`Edited by:`, `${message.author.tag}`)
                        .setTimestamp()
                        .addField(`Original reason:`, em.fields[3].value)
                        .addField(`New reason:`, reason)
                        .addField(`Message edited:`, `[JumpTo](${logmes.url})`)
                        .addField(`Case number:`, `#${row.caseNumber + 1}`)
                        .addField("Message:", `[JumpTo](${message.url})`)
                        .setThumbnail(message.author.avatarURL);
                    message.guild.channels.get(finder.id).send(embed);
                }).catch(e => {
                    console.log(e);
                    funcs.send(`Error: ${e.message}`);
                });
            });
        });
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "reason",
    aliases: [],
    usage: "Use this command to change a reason from modlogs.",
    commandCategory: "moderation",
    cooldownTime: '5'
};