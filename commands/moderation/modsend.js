module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT cn.caseNumber, gs.logsEnabled, gp.prefix, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId LEFT JOIN guildPrefix AS gp ON cn.guildId = gp.guildId WHERE cn.guildId ="${message.guild.id}"`, (e, row) => {
        con.query(`SELECT * FROM guildModMail WHERE guildId ="${message.guild.id}"`, (e, modmail) => {
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                row = row[0];
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_GUILD";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                modmail = modmail[0];
                const text = args.join(` `);
                if (!text) return funcs.send(`You did not enter anything to send to mods!`);
                const guildMods = message.guild.members.filter(m => m.hasPermission('MANAGE_GUILD'));
                if (rows.length == 1 && guildMods.size == 0) return funcs.send(`No mods in this guild detected. (Members with MANAGE_GUILD)`);
                const usersSent = [];
                if (modmail.mode == "dm") {
                    rows.forEach(async row => {
                        const user = await bot.fetchUser(row.guildMods);
                        if (usersSent.includes(user.id)) return;
                        if (!user) return;
                        if (user.id == message.author.id) return;
                        if (user.bot) return;
                        user.createDM().then(channel => channel.send(`${message.author.tag} (Moderator) says: ${text} (mod mail)__**`)).catch(() => { });
                        usersSent.push(user.id);
                    });
                    guildMods.forEach(mod => {
                        if (usersSent.includes(mod.id)) return;
                        if (mod.id == message.author.id) return;
                        if (mod.user.bot) return;
                        mod.user.createDM().then(channel => channel.send(`${message.author.tag} (Moderator) says: ${text} (mod mail)__**`)).catch(() => { });
                        usersSent.push(mod.id);
                    });
                } else {
                    const channel = message.guild.channels.find(c => c.name == modmail.channel);
                    if (!channel) return funcs.send(`Could not find the modmail channel that has been set. (${modmail.channel})`);
                    channel.send(`**__${message.author.tag} (Moderator) says: ${text} (mod mail)__**`);
                }
                funcs.send(`Mail sent.`);
            });
        });
    });
};

module.exports.config = {
    name: "modsend",
    aliases: [],
    usage: "Use this command to send a message to the guild mods.",
    commandCategory: "moderation",
    cooldownTime: "0"
};
