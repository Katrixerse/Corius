const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs, sql, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
                let row1 = rows.map(r => r.guildMods);
                const permissionNeeded = "MANAGE_ROLES";
                if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
                if (!message.guild.me.hasPermission(permissionNeeded)) return funcs.send(`I do not have the permission ${permissionNeeded} to execute this command.`, true);
                const person = message.mentions.members.first();
                if (!person) return funcs.send(`Missin argument: rrole --> memberToRemoveRole <-- roleToRemove`);
                if (person.id == message.author.id || person.user.bot) return funcs.send(`Not a valid member!`);
                if (person.highestRole.position >= message.guild.me.highestRole.position) return funcs.send(`That user has the same position or a higher position than me!`);
                if (person.highestRole.position >= message.member.highestRole.position) return funcs.send(`That user has the same position or a higher position than you!`);
                const role = args.slice(1).join(` `);
                if (!role) return funcs.send(`Missing argument: role memberToRemoveRole --> roleToRemove <--`);
                const roleToAdd = message.guild.roles.find(r => r.name == role);
                if (!roleToAdd) return funcs.send(`Role not found in this guild!`);
                if (roleToAdd.position >= message.guild.me.highestRole.position) return funcs.send(`That role has the same position or a higher position than me!`);
                if (roleToAdd.position >= message.member.highestRole.position) return funcs.send(`That role has the same position or a higher position than you!`);
                if (person.roles.filter(r => r.name == role).size == 0) return funcs.send(`Member does not have that role!`);
                person.removeRole(roleToAdd, `Removed by ${message.author.username}`).catch((e) => {
                    return funcs.send(`Error: ${e.message}`);
                });
                funcs.send(`Member has been removed that role!`, false);
                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                if (row.logsEnabled !== "true") return;
                let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                if (!finder) return;
                let embed = new MessageEmbed()
                    .setTitle(`Role Removed.`)
                    .setTimestamp()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setThumbnail(bot.user.avatarURL)
                    .setColor(funcs.rc())
                    .addField(`Role:`, role)
                    .addField(`Removed by:`, message.author.username)
                    .addField(`Removed at`, message.createdAt.toDateString())
                    .addField(`Case number:`, `#${row.caseNumber + 1}`)
                    .addField(`Message:`, `[JumpTo](${message.url})`);
                message.guild.channels.get(finder.id).send(embed);
            });
        });
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "rrole",
    aliases: [],
    usage: "Use this command to remove someone a role.",
    commandCategory: "moderation",
    cooldownTime: '0'
};