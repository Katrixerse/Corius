const { MessageEmbed } = require('discord.js');
module.exports.run = (bot, message, args, funcs, con) => {
  con.query(`SELECT gc.caseNumber, gs.logsEnabled, gs.logsChannel, gs.economyEnabled FROM guildCasenumber AS gc LEFT JOIN guildSettings AS gs ON gs.guildId = gc.guildId WHERE gc.guildId ="${message.guild.id}"`, (e, row) => {
    row = row[0];
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
      let row1 = rows.map(r => r.guildMods);
      const permissionNeeded = "MANAGE_GUILD";
      if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission to use this command.`, true);

      message.channel.send(`**__What would you like to do?__**\n\`\`\`Enable/Disable economy (say 1)\nReset cash for guild (say 2)\nType exit to cancel\`\`\``).then(() => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
          max: 1,
          errors: ["time"],
          time: 30000
        }).then((response) => {
          if (!response) return;
          response = response.array()[0];
          if (response.content === "1") {
            if (row.economyEnabled === 'false') {
              message.channel.send('**__Economy is disabled would you like to enable it?__**')
                .then(() => {
                  message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                    .then((response) => {
                      if (!response) return;
                      response = response.array()[0];
                      if (response.content.toLowerCase() === 'yes') {
                        con.query(`UPDATE guildSettings SET economyEnabled = 'true' WHERE guildId = '${message.guild.id}'`);
                        funcs.send('Economy has been enabled');
                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                        if (!finder) return;
                        let embed = new MessageEmbed()
                          .setTitle(`Economy Enabled.`)
                          .setTimestamp()
                          .setThumbnail(bot.user.avatarURL)
                          .setColor(funcs.rc())
                          .addField(`Enabled by:`, message.author.username)
                          .addField(`Enabled at`, message.createdAt.toDateString())
                          .addField(`Case number:`, `#${row.caseNumber + 1}`)
                          .addField(`Message:`, `[JumpTo](${message.url})`);
                        message.guild.channels.get(finder.id).send(embed);
                      } else {
                        funcs.send('You have decided not to enable, command has been cancelled.');
                      }
                    });
                });
            } else {
              message.channel.send('**__Economy is enabled would you like to disable it?__**')
                .then(() => {
                  message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                    .then((response) => {
                      if (!response) return;
                      response = response.array()[0];
                      if (response.content.toLowerCase() === 'yes') {
                        con.query(`UPDATE guildSettings SET economyEnabled = 'false' WHERE guildId = '${message.guild.id}'`);
                        funcs.send('Economy has been disabled.');
                        con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                        let finder = message.guild.channels.find(c => c.name == row.logsChannel);
                        if (!finder) return;
                        let embed = new MessageEmbed()
                          .setTitle(`Economy Disabled.`)
                          .setTimestamp()
                          .setThumbnail(bot.user.avatarURL)
                          .setColor(funcs.rc())
                          .addField(`Disabled by:`, message.author.username)
                          .addField(`Disabled at`, message.createdAt.toDateString())
                          .addField(`Case number:`, `#${row.caseNumber + 1}`)
                          .addField(`Message:`, `[JumpTo](${message.url})`);
                        message.guild.channels.get(finder.id).send(embed);
                      } else {
                        funcs.send('You have decided not to disable command has been cancelled');
                      }
                    });
                }).catch((e) => {
                  funcs.send(`You ran out of time or an error occured!`);
                  console.log(`Error: ${e.message} in guild ${message.guild.name} command commandName`);
                });
            }
          } else if (response.content === '2') {
            message.channel.send(`**__Are you sure you want to reset cash in this guild?__**`).then(() => {
              message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                errors: ["time"],
                time: 30000
              }).then((response) => {
                if (!response) return;
                response = response.array()[0];
                if (response.content.toLowerCase() === "yes") {
                  con.query(`DELETE FROM guildCash WHERE guildId="${message.guild.id}"`);
                }
              });
            });
          } else if (response.content.toLowerCase() === 'exit') {
            funcs.send('Command cancelled');
          }
        });
      });
    });
  });
};

module.exports.config = {
  name: "manageeconomy",
  aliases: [],
  usage: "Allows you to manage economy settings in this guild.",
  commandCategory: "moderation",
  cooldownTime: "0"
};
