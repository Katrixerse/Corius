const { RichEmbed } = require("discord.js");
module.exports.run = (bot, message, args, funcs, con) => {
  const permissionNeeded = "KICK_MEMBERS";
  con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
    let row1 = rows.map(r => r.guildMods);
    if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
    if (!message.guild.me.hasPermission(permissionNeeded)) return funcs.send(`I do not have the permission ${permissionNeeded} to execute this command!`, true);
    message.channel.send(`__**Who would you like to kick? (Mention) (Say exit to cancel.)**__`).then(() => {
      message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        errors: ["time"],
        time: 30000
      }).then((response) => {
        if (response.array()[0].content == "1") {
          return funcs.send(`Example: \n<@307472480627326987> spamming too much`);
        } else if (response.array()[0].content == "exit") {
          return funcs.send(`Command canceled.`);
        } else {
          const memberToKick = response.array()[0].mentions.members.first();
          if (!memberToKick) return funcs.send(`Not a valid mention!`, true);
          if (memberToKick.highestRole.position >= message.member.highestRole.position) return funcs.send(`That member has a higher position or the same position as you.`, true);
          if (memberToKick.highestRole.position >= message.guild.me.highestRole.position) return funcs.send(`That member has a higher position or the same position as me.`, true);
          //memberToKick.send(`__**You have been kicked by ${message.author.username} from ${message.guild.name} for ${reason}.**__`);
          let reason;
          message.channel.send(`__**Enter the reason to kick that member. (say 1 if you don't want to provide a reason)**__`).then(() => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, {
              max: 1,
              errors: ["time"],
              time: 30000
            }).then((response) => {
              if (response.array()[0].content == "1") {
                reason = "Moderator didn't provide a reason.";
              } else {
                reason = response.array()[0].content.substr(0, 500);
              }
              funcs.send(`I have successfully kicked ${memberToKick} for ${reason}!`, false);
              memberToKick.kick(reason);
              con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${memberToKick.id}"`, async (e, row) => {
                if (row.length == 0) {
                  await con.query(`INSERT INTO userPunishments(guildId, userId, warnings, kicks, mutes, bans, reports) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 0, 1, 0, 0, 0]);
                }
                row = row[0];
                con.query(`UPDATE userPunishments SET kicks = ${row.kicks + 1} WHERE guildId = ${message.guild.id} AND userId = ${memberToKick.id}`);
                con.query(`SELECT gl.logsEnabled, gl.logsChannel, cs.caseNumber FROM guildSettings AS gl LEFT JOIN guildCasenumber AS cs ON gl.guildId = cs.guildId WHERE gl.guildId ="${message.guild.id}"`, (e, row) => {
                  row = row[0];
                  con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                  if (row.logsEnabled == "false") return;
                  const finder = message.guild.channels.find(c => c.name == row.logsChannel);
                  if (!finder) return;
                  const embed = new RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setColor(funcs.rc())
                    .setFooter(bot.user.username)
                    .setTitle(`Member Kicked`)
                    .addField(`Member:`, memberToKick.user.username)
                    .addField(`Kicked by:`, message.author.username)
                    .addField(`Kicked at:`, new Date().toDateString())
                    .addField(`Reason:`, reason)
                    .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                    .addField("Message:", `[JumpTo](${message.url})`)
                    .setThumbnail(message.author.avatarURL);
                  message.guild.channels.get(finder.id).send(embed);
                });
              });
            });
          }).catch((e) => {
            funcs.send(`You ran out of time or an error occured!`);
            console.log(`Error: ${e.message} in guild ${message.guild.name} command kick`);
          });
        }
      }).catch((e) => {
        funcs.send(`You ran out of time or an error occured!`);
        console.log(`Error: ${e.message} in guild ${message.guild.name} command kick`);
      });
    });
  });
};

module.exports.config = {
  name: "kick",
  aliases: [],
  usage: "Kicks a user from the server.",
  commandCategory: "moderation",
  cooldownTime: '0'
};