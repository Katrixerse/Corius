const { richEmbed } = require("discord.js");
const addEntry = require('../../handlers/addDbEntry.js');

module.exports.run = (bot, message, args, funcs, con) => {
  const permissionNeeded = "BAN_MEMBERS";
  if (!message.member.hasPermission(permissionNeeded, false, true, true)) return funcs.send(`You do not have the permission to use this command.`, true);
  if (!message.guild.me.hasPermission(permissionNeeded)) return funcs.send(`I do not have the permission to execute this command.`, true);
  message.channel.send("__**Please mention or enter the username of the member you want to ban. Say 1 to ban by ID. Say exit to cancel.**__").then(() => {
    message.channel.awaitMessages(m => m.author.id === message.author.id, {
      time: 30000,
      errors: ["time"],
      max: 1
    }).then((response) => {
      if (response.array()[0].mentions.users.first() !== undefined) {
        const userToBan = response.array()[0].mentions.members.first();
        if (userToBan.highestRole.position >= message.member.highestRole.position) return funcs.send(`You cannot ban that member. They have the same position as you, or a higher one.`, true);
        if (userToBan.highestRole.position >= message.guild.me.highestRole.position) return funcs.send(`I cannot ban that member. They have the same position as me, or a higher one.`, true);
        message.guild.ban(userToBan);
        con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${userToBan.id}"`, async (e, row) => {
          if (!row) {
            addEntry.addDbEntryUserId(message.guild.id, userToBan.id, 'ban');
          }
          row = row[0];
          con.query(`UPDATE userPunishments SET bans = ${row.bans + 1} WHERE guildId = ${message.guild.id} AND userId = ${userToBan.id}`);
        });
        funcs.send(`I have successfully banned ${userToBan}. Mission complete boys.`, false);
        con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
          row = row[0];
          con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
          const LogsEmbed = new richEmbed()
            .setTitle(`:hammer: Member Banned :hammer:`)
            .setAuthor(message.author.tag, message.author.avatarURL)
            .addField(`Member banned:`, userToBan.user.username)
            .addField(`Banned by:`, message.author.username)
            .addField(`Banned at:`, new Date().toDateString())
            .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
            .setColor(funcs.rc())
            .setFooter(bot.user.username);
          if (row.logsEnabled !== "true") return;
          const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
          if (logsChannel === undefined) return;
          message.guild.channels.get(logsChannel.id).send(LogsEmbed);
        });
      } else if (response.array()[0].content == "exit") {
        return funcs.send(`Command canceled.`);
      } else if (response.array()[0].content == '1') {
        message.channel.send(`__**What ID would you like to ban? Say exit to cancel.**__`).then(() => {
          message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            errors: ["time"],
            time: 30000
          }).then((response) => {
            response = response.array()[0].content;
            if (response == 'exit') return;
            const ID = response;
            bot.fetchUser(ID).then(user => {
              if (!user) return funcs.send(`User not found!`);
              message.guild.fetchBans().then(users => {
                if (users.has(user.id)) return funcs.send(`User is already banned!`);
                message.guild.ban(ID);
                funcs.send(`ID successfully banned! (${user.username})`);
                con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`, async (e, row) => {
                  if (row.length == 0) {
                    addEntry.addDbEntryUserId(message.guild.id, user.id, 'ban');
                  }
                  row = row[0];
                  con.query(`UPDATE userPunishments SET bans = ${row.bans + 1} WHERE guildId = ${message.guild.id} AND userId = ${user.id}`);
                });
                con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
                  row = row[0];
                  con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                  const LogsEmbed = new richEmbed()
                    .setTitle(`:hammer: Member Banned :hammer:`)
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .addField(`Member banned:`, user.username)
                    .addField(`Banned by:`, message.author.username)
                    .addField(`Banned at:`, new Date().toDateString())
                    .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                    .setColor(funcs.rc())
                    .setFooter(bot.user.username);
                  if (row.logsEnabled !== "true") return;
                  const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
                  if (logsChannel === undefined) return;
                  message.guild.channels.get(logsChannel.id).send(LogsEmbed);
                });
              });
            }).catch((e) => {
              funcs.send(`Error: ${e.message}. (user not found)`);
            });
          }).catch((e) => {
            funcs.send(`You ran out of time or an error occured!`);
            console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
          });
        });
      } else {
        const userToBan = response.array()[0];
        const memberToBan = message.guild.members.filter(m => m.user.username.toLowerCase() === userToBan.content.toLowerCase());
        if (memberToBan === undefined || memberToBan === null || memberToBan.size == 0) return funcs.send(`Cannot find a member with that username. (There were also no mentions in your message.)`, true);
        if (memberToBan.size > 1) {
          const multipleUsersEmbed = new richEmbed()
            .setColor(funcs.rc())
            .setTitle(`Multiple Users Detected!`);
          var n = 0;
          memberToBan.forEach((user) => {
            multipleUsersEmbed.addField(`${n += 1}:`, `${user.user.username} (ID: ${user.id} )`);
          });
          message.channel.send(multipleUsersEmbed);
          n = 0;
          message.channel.send(`__**Multiple users with that username have been detected. Which one would you like to ban? (Say exit to cancel) (To pick an user, enter the number bound to them)**__`).then(() => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, {
              errors: ["time"],
              max: 1,
              time: 30000
            }).then((response) => {
              if (response.array()[0].content == "exit") {
                return funcs.send(`Canceled.`);
              }
              const numberPicked = response.array()[0].content;
              if (isNaN(parseInt(numberPicked))) return funcs.send(`Not a valid number!`);
              if (parseInt(numberPicked) > memberToBan.size || parseInt(numberPicked) < 0) return funcs.send(`Not a valid number!`);
              multipleUsersEmbed.fields.forEach(field => {
                if (field.name.startsWith(numberPicked)) {
                  const member = field.value.split(" ")[2];
                  const memberToBan = message.guild.members.find(m => m.id == member);
                  if (memberToBan.highestRole.position >= message.member.highestRole.position) return funcs.send(`You cannot ban that member. They have the same position as you, or a higher one.`, true);
                  if (memberToBan.highestRole.position >= message.guild.me.highestRole.position) return funcs.send(`I cannot ban that member. They have the same position as me, or a higher one.`, true);
                  //memberToBan.send(`__**You have been banned by ${message.author.username} from ${message.guild.name} for ${reason}.**__`);
                  message.guild.ban(memberToBan);
                  con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${memberToBan.id}"`, async (e, row) => {
                    if (row.length == 0) {
                      addEntry.addDbEntryUserId(message.guild.id, memberToBan.id, 'ban');
                    }
                    row = row[0];
                    con.query(`UPDATE userPunishments SET bans = ${row.bans + 1} WHERE guildId = ${message.guild.id} AND userId = ${memberToBan.id}`);
                  });
                  funcs.send(`I have successfully banned ${memberToBan.user.username}. Mission complete boys.`, false);
                  con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
                    row = row[0];
                    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                    const LogsEmbed = new richEmbed()
                      .setTitle(`:hammer: Member Banned :hammer:`)
                      .setAuthor(message.author.tag, message.author.avatarURL)
                      .addField(`Member banned:`, memberToBan.user.username)
                      .addField(`Banned by:`, message.author.username)
                      .addField(`Banned at:`, new Date().toDateString())
                      .addField(`Message:`, `[JumpTo](${message.url})`)
                      .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                      .setColor(funcs.rc())
                      .setThumbnail(message.author.avatarURL)
                      .setFooter(bot.user.username);
                    if (row.logsEnabled !== "true") return;
                    const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
                    if (logsChannel === undefined) return;
                    message.guild.channels.get(logsChannel.id).send(LogsEmbed);
                  });
                }
              });
            });
          });
        } else {
          if (memberToBan.first().highestRole.position >= message.member.highestRole.position) return funcs.send(`You cannot ban that member. They have the same position as you, or a higher one.`, true);
          if (memberToBan.first().highestRole.position >= message.guild.me.highestRole.position) return funcs.send(`I cannot ban that member. They have the same position as me, or a higher one.`, true);
          //memberToBan.send(`__**You have been banned by ${message.author.username} from ${message.guild.name} for ${reason}.**__`);
          message.guild.ban(memberToBan);
          con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${memberToBan.id}"`, async (e, row) => {
            if (row.length == 0) {
              addEntry.addDbEntryUserId(message.guild.id, memberToBan.id, 'ban');
            }
            row = row[0];
            con.query(`UPDATE userPunishments SET bans = ${row.bans + 1} WHERE guildId = ${message.guild.id} AND userId = ${memberToBan.id}`);
          });
          funcs.send(`I have successfully banned ${memberToBan.user.username}. Mission complete boys.`, false);
          con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
            row = row[0];
            con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
            const LogsEmbed = new richEmbed()
              .setTitle(`:hammer: Member Banned :hammer:`)
              .setAuthor(message.author.tag, message.author.avatarURL)
              .addField(`Member banned:`, memberToBan.user.username)
              .addField(`Banned by:`, message.author.username)
              .addField(`Banned at:`, new Date().toDateString())
              .addField(`Message:`, `[JumpTo](${message.url})`)
              .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
              .setColor(funcs.rc())
              .setFooter(bot.user.username);
            if (row.logsEnabled !== "true") return;
            const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
            if (logsChannel === undefined) return;
            message.guild.channels.get(logsChannel.id).send(LogsEmbed);
          });
        }
      }
    });
  });
};

module.exports.config = {
  name: "ban",
  aliases: [""],
  usage: "Bans a user in the guild.",
  commandCategory: "moderation",
  cooldownTime: '0'
};