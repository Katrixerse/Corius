const {
    richEmbed
} = require('discord.js');
let n = 0;

module.exports.run = async (bot, message, args, funcs, sql, con) => {
    try {
        con.query(`SELECT cn.caseNumber, gs.logsEnabled, gs.logsChannel FROM guildCasenumber as cn LEFT JOIN guildSettings as gs ON gs.guildId = cn.guildId WHERE cn.guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            const permissionNeeded = "ADMINISTRATOR";
            if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
            const role = args.join(` `);
            if (!role) return funcs.send(`You did not specify a role to add to all members!`);
            const check = message.guild.roles.find(r => r.name == role);
            if (!check) return funcs.send(`Role not found!`);
            if (!message.guild.me.hasPermission(`MANAGE_ROLES`)) return funcs.send(`I do not have the MANAGE_ROLES permission!`);
            const membersWithLowerPosition = message.guild.members.filter(m => m.highestRole.position <= message.guild.me.highestRole.position);
            if (membersWithLowerPosition.size == 0) return funcs.send(`There are no users in this guild that have a lower position than me!`);
            const membersWithLowerPositionThanUser = message.guild.members.filter(m => m.highestRole.position <= message.member.highestRole.position);
            if (membersWithLowerPositionThanUser.size == 0) return funcs.send(`There are no users in this guild that have a lower position than you!`);
            await message.guild.members.forEach(async member => {
                if (member.highestRole.position >= message.guild.me.highestRole.position) return;
                if (member.roles.filter(r => r.name == role).size > 0) return;
                if (member.user.bot) return;
                await setTimeout(async function () {
                    n += 1;
                    await member.addRole(check);
                }, 700);
            });
            const membersaddedrole = message.guild.members.filter(member => member.highestRole.position < message.guild.me.highestRole.position).filter(member => member.roles.filter(r => r.name == role).size == 0).filter(member => !member.user.bot);
            await funcs.send(`Added role to ${membersaddedrole.size} member(s) (some members might already have the role).`);
            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
            if (row.logsEnabled !== "true") return;
            let finder = message.guild.channels.find(c => c.name == row.logsChannel);
            if (!finder) return;
            if (n == 0) return;
            let embed = new richEmbed()
                .setTitle(`Role Added to All Users.`)
                .setTimestamp()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setThumbnail(bot.user.avatarURL)
                .setColor(funcs.rc())
                .addField(`Role:`, role)
                .addField(`Added by:`, message.author.username)
                .addField(`Added to:`, `${membersaddedrole.size} user(s)`)
                .addField(`Added at:`, message.createdAt.toDateString())
                .addField(`Case number:`, `#${row.caseNumber + 1}`)
                .addField(`Message:`, `[JumpTo](${message.url})`);
            message.guild.channels.get(finder.id).send(embed);
        });
        n = 0;
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "roleall",
    aliases: ["rall"],
    usage: "Use this command to give a role to every member of the guild, that have a lower position than the bot and the member that used the command, if it has permissions.",
    commandCategory: "moderation",
    cooldownTime: '5'
};