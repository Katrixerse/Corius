const {
    MessageEmbed
} = require('discord.js');
let n = 0;

module.exports.run = async (bot, message, args, funcs, sql, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            const permissionNeeded = "ADMINISTRATOR";
            if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
            const whoto = args[0];
            if (whoto !== "humans" && whoto !== "bots") return funcs.send(`Missing argument: --> who to give roles (humans | bots) <-- role`);
            if (whoto == "humans") {
                const role = args.slice(1).join(` `);
                if (!role) return funcs.send(`You did not specify a role to remove from all members!`);
                const check = message.guild.roles.find(r => r.name == role);
                if (!check) return funcs.send(`Role not found!`);
                if (!message.guild.me.hasPermission(`MANAGE_ROLES`)) return funcs.send(`I do not have the MANAGE_ROLES permission!`);
                const membersWithLowerPosition = message.guild.members.filter(m => m.highestRole.position <= message.guild.me.highestRole.position);
                if (membersWithLowerPosition.size == 0) return funcs.send(`There are no users in this guild that have a lower position than me!`);
                const membersWithLowerPositionThanUser = message.guild.members.filter(m => m.highestRole.position <= message.member.highestRole.position);
                if (membersWithLowerPositionThanUser.size == 0) return funcs.send(`There are no users in this guild that have a lower position than you!`);
                await message.guild.members.forEach(async member => {
                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                    if (member.roles.filter(r => r.name == role).size == 0) return;
                    if (member.user.bot) return;
                    setTimeout(async () => {
                        n += 1;
                        await member.removeRole(check);
                    }, 700);
                });
                const membersaddedrole = message.guild.members.filter(member => member.highestRole.position < message.guild.me.highestRole.position).filter(member => member.roles.filter(r => r.name == role).size > 0).filter(member => !member.user.bot);
                funcs.send(`Removed role from ${membersaddedrole.size} member(s) (some members might not have the role).`);
                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                if (row.logsEnabled !== "true") return;
                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                if (!finder) return;
                if (membersaddedrole.size == 0) return;
                let embed = new MessageEmbed()
                    .setTitle(`Role Removed from All Users.`)
                    .setTimestamp()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setThumbnail(bot.user.avatarURL)
                    .setColor(funcs.rc())
                    .addField(`Role:`, role)
                    .addField(`Removed by:`, message.author.username)
                    .addField(`Removed from:`, `${membersaddedrole.size} user(s)`)
                    .addField(`Removed at:`, message.createdAt.toDateString())
                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                    .addField(`Message:`, `[JumpTo](${message.url})`);
                message.guild.channels.get(finder.id).send(embed);
            } else if (whoto == "bots") {
                const role = args.slice(1).join(` `);
                if (!role) return funcs.send(`You did not specify a role to remove from all bots!`);
                const check = message.guild.roles.find(r => r.name == role);
                if (!check) return funcs.send(`Role not found!`);
                if (!message.guild.me.hasPermission(`MANAGE_ROLES`)) return funcs.send(`I do not have the MANAGE_ROLES permission!`);
                const membersWithLowerPosition = message.guild.members.filter(m => m.highestRole.position <= message.guild.me.highestRole.position).filter(m => m.user.bot);
                if (membersWithLowerPosition.size == 0) return funcs.send(`There are no users in this guild that have a lower position than me!`);
                const membersWithLowerPositionThanUser = message.guild.members.filter(m => m.highestRole.position <= message.member.highestRole.position).filter(m => m.user.bot);
                if (membersWithLowerPositionThanUser.size == 0) return funcs.send(`There are no users in this guild that have a lower position than you!`);
                await message.guild.members.forEach(async member => {
                    if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                    if (member.roles.filter(r => r.name == role).size == 0) return;
                    if (!member.user.bot) return;
                    setTimeout(async () => {
                        n += 1;
                        await member.removeRole(check);
                    }, 700);
                });
                const membersaddedrole = message.guild.members.filter(member => member.highestRole.position < message.guild.me.highestRole.position).filter(member => member.roles.filter(r => r.name == role).size > 0).filter(member => member.user.bot);
                funcs.send(`Removed role from ${membersaddedrole.size} bot(s) (some bots might not have the role).`);
                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                if (row.logsEnabled !== "true") return;
                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                if (!finder) return;
                if (membersaddedrole.size == 0) return;
                let embed = new MessageEmbed()
                    .setTitle(`Role Removed from All Bots.`)
                    .setTimestamp()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setThumbnail(bot.user.avatarURL)
                    .setColor(funcs.rc())
                    .addField(`Role:`, role)
                    .addField(`Removed by:`, message.author.username)
                    .addField(`Removed from:`, `${membersaddedrole.size} bot(s)`)
                    .addField(`Removed at:`, message.createdAt.toDateString())
                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                    .addField(`Message:`, `[JumpTo](${message.url})`);
                message.guild.channels.get(finder.id).send(embed);
            }
        });
        n = 0;
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "rroleall",
    aliases: ["rrall"],
    usage: "Use this command to remove a role from every member of the guild, that have a lower position than the bot and the member that used the command, if it has permissions.",
    commandCategory: "moderation",
    cooldownTime: '5'
};