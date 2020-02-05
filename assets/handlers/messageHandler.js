const modFuncs = require('../../assets/handlers/moderationfuncs.js');
const Funcs = require('./../exports/funcs');
const usedCommandRecently = new Set();
const { dbConnect } = require('./dbConnection.js');

let con;
con = dbConnect();

var cc = 0;
var cs = 0;

function increment() {
    if (cc >= 0) {
        cc += 1;
        return cc;
    } else
        cs += 1
    return cs;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const cooldown = new Set();

const economyCooldown = new Set();

module.exports = {
  handleMessages: async (message, row, user, command, bot, funcs, args, con) => {
    const member = message.member;
    //Leveling
    if (row.levelingEnabled === 'true') {
      handleLeveling(message, member, funcs);
    }
    if (row.economyEnabled === 'true') {
      handleEconomy(con, message);
    }

    //Custom commands
    handleCustomCommands(message, con, command, bot, funcs, args);
    if (!bot.commands.get(command)) return;
  },
  handleAwaits: async (message, row, user, command, bot, funcs, args, con) => {
    // Blacklist
    handleBlacklistedUsers(message, con);
    //handleDCIC(message, con, command);
    if (user !== undefined) return "blacklisted";
        let commandCoolDown;
        if (!bot.aliases.has(command) && !bot.commands.has(command)) {
          commandCoolDown = 0;
        } else if (bot.aliases.has(command)) {
          commandCoolDown = parseInt(bot.commands.get(bot.aliases.get(command)).config.cooldownTime);
        } else if (bot.commands.has(command)) {
          commandCoolDown = parseInt(bot.commands.get(command).config.cooldownTime);
        }
        let res;
        if (commandCoolDown >= 1) {
          res = await handleCommandCooldown(command, message, commandCoolDown, funcs);
        }
        if (res == "cooldown") return "cooldown";
  },
  handleMessagesBeforePrefix: async (message, row, user, command, bot, funcs, args, rows, con) => {
    autoMod(message, con);
    const member = message.member;
    //Leveling
    if (row.levelingEnabled === 'true') {
      handleLeveling(message, member, funcs);
    }
    if (row.economyEnabled === 'true') {
      handleEconomy(con, message);
    }
    // Afk
    if (rows !== undefined && rows.length !== 0 && rows[0].isAfk >= 1 && rows[0].afkId == message.author.id) {
      message.channel.send(`**__${message.author.username}, you are no longer afk!__**`);
      con.query(`UPDATE afk SET isAfk = 0, afkReason = "none" WHERE guildId = '${message.guild.id}' AND userId = '${message.author.id}'`);
    }
    // Afk
    if (message.mentions.members.first()) {
      const user = message.mentions.members.first();
      con.query(`SELECT * FROM afk WHERE guildId = "${message.guild.id}" AND userId = "${user.id}"`, (e, row) => {
        if (rows !== undefined && rows.length !== 0 && rows[0].isAfk >= 1) return message.channel.send(`**__${user.user.username} is currently afk: ${rows[0].afkReason}__**`);
      });
    }
    // Blacklisted words
    handleBlacklistedWords(message, con);
    handleCustomResponses(message, con, command, bot, funcs, args);
  }
};

function handleEconomy(con, message) {
          //con.query(`CREATE TABLE IF NOT EXISTS guildCash (guildId TEXT, userId TEXT, userCash INTEGER, userBankedCash INTEGER, username TEXT, hasRecievedCash TEXT, hasBeenRobbed TEXT, has_cheated TEXT)`);
          const cashToGive = getRndInteger(50, 200);
          if (economyCooldown.has(message.author.id) && economyCooldown.has(message.guild.id)) return;
          con.query(`SELECT * FROM guildCash WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row) => {
              if (e) {
                  con.query(`CREATE TABLE IF NOT EXISTS guildCash (guildId TEXT(30), userId TEXT(30), userCash INTEGER(255), userBankedCash INTEGER(255), username TEXT(30), hasRecievedCash TEXT(30), hasBeenRobbed TEXT(30), has_cheated TEXT(30))`, () => {
                      console.log('inserting in guildCash because error')
                      con.query(`INSERT INTO guildCash (guildId, userId, userCash, userBankedCash, username, hasRecievedCash, hasBeenRobbed, has_cheated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, cashToGive, 0, message.author.username, "false", "false", "false"]);
                      if (!economyCooldown.has(message.guild.id)) economyCooldown.add(message.guild.id);
                      economyCooldown.add(message.author.id);
                  });
                  return;
              }
              if (row !== undefined && row.length !== 0 && row[0].userCash >= 1000000) return;
              if (row !== undefined && row.length !== 0 && cashToGive + row[0].userCash >= 1000000) return con.query(`UPDATE guildCash SET userCash = 1000000 WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
              if (!row || row.length == 0) {
                  con.query(`INSERT INTO guildCash (guildId, userId, userCash, userBankedCash, username, hasRecievedCash, hasBeenRobbed, has_cheated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, cashToGive, 0, message.author.username, "false", "false", "false"]);
                  if (!economyCooldown.has(message.guild.id)) economyCooldown.add(message.guild.id);
                  economyCooldown.add(message.author.id);
              } else if (row.length > 1) {
                  con.query(`DELETE FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}" LIMIT 1`);
              } else {
                  con.query(`UPDATE guildCash SET userCash = ${row[0].userCash + cashToGive} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
                  if (!economyCooldown.has(message.guild.id)) economyCooldown.add(message.guild.id);
                  economyCooldown.add(message.author.id);
              }
          });
          setTimeout(() => {
            economyCooldown.delete(message.author.id);
          }, 60000);
}

function autoMod(message, con) {
  con.query(`SELECT gam.antiWebsites, gam.antiAscii, gam.antiDuplicates, gam.antiCapslock, gam.antiPing, gam.ignoreChannels, gam.IgnoreRoles, gam.warnOnAutoMod, gs.logsChannel, gs.logsEnabled FROM guildAutoModeration as gam LEFT JOIN guildSettings as gs ON gs.guildId = gam.guildId WHERE gam.guildId =${message.guild.id}`, async (e, row) => {
    //let ignoreChannel = row.map(r => r.ignoreChannels);
    row = row[0];
    var ignoreChannel = row.ignoreChannels.split(", ")
    let ignoreRole = row.IgnoreRoles.split(", ")
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
        let mods = rows.map(r => r.mod);
        const me = message.guild.me;
        const member = message.member;
        if (row.antiWebsites == "true") {
            modFuncs.antiWebLink(row, mods, member, me, message, ignoreChannel, ignoreRole);
        }
        if (row.antiAscii == "true") {
            modFuncs.asciiProtection(row, mods, member, me, message, ignoreChannel, ignoreRole);
        }
        if (row.antiDuplicates == "true") {
            modFuncs.antidupChars(row, mods, member, me, message, ignoreChannel, ignoreRole);
        }
        if (row.antiCapslock == "true") {
            modFuncs.antiCapsLock(row, mods, member, me, message, ignoreChannel, ignoreRole);
        }
        if (row.antiInvites == "true") {
            modFuncs.antiInvites(row, mods, member, me, message, ignoreChannel, ignoreRole);
        }
        if (row.antiPing == 'true') {
            modFuncs.antiPings(row, mods, member, me, message, ignoreChannel, ignoreRole);
        }
    });
});
}

function handleBlacklistedWords(message, con) {
  con.query(`SELECT * FROM guildWords WHERE guildWords.guildId ="${message.guild.id}"`, (e, words) => {
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, mods) => {
        const row1 = mods.map(m => m.guildMods);
        const wordsMapped = words.map(w => w.words);
        if (row1.includes(message.author.id)) return;
        wordsMapped.forEach(word => {
            if (message.content.toLowerCase().includes(word)) {
                message.delete().catch(() => { });
            }
        });
    });
});
}

function handleBlacklistedUsers(message, con) {
  con.query(`SELECT * FROM guildBlacklistedUsers WHERE guildBlacklistedUsers.guildId ="${message.guild.id}" AND user ="${message.author.id}"`, (e, row) => {
    if (row !== undefined || row.length >= 1) return;
});
}

function handleCustomCommands(message, con, command, bot, funcs, args) {
  const commandFix = command.replace(/\"/g);
  con.query(`SELECT * FROM guildCustomCommands WHERE guildCustomCommands.guildId ="${message.guild.id}" AND command_name ="${commandFix}"`, (e, row) => {
      if (!row || row.length == 0) return;
      row = row[0];
      const output = row.command_output;
      let newoutput = output.replace(/\%NAME\%/g, message.author.username).replace(/\%PING\%/g, message.member).replace(/\%AUTHORID\%/g, message.author.id).replace(/\%MEMBERGAME\%/g, message.author.presence.game === null ? "none" : message.author.presence.game.name).replace(/\%MEMBERSTATUS\%/g, message.author.presence.status).replace(/\%MEMBERNICK\%/g, message.member.nickname !== null ? message.member.nickname : "none").replace(/\%MEMBERJOINED\%+/g, message.member.joinedAt.toDateString()).replace(/\%ROLENAME\%/g, message.member.highestRole.name).replace(/\%SERVERID\%/g, message.guild.id).replace(/\%GUILDNAME\%/g, message.guild.name).replace(/\%GUILDREGION\%/g, message.guild.region).replace(/\%MEMBERCOUNT\%/g, message.guild.members.size).replace(/\%OWNERID\%/g, message.guild.owner.id).replace(/\%CHANNELID\%+/g, message.channel.id).replace(/\%CHANNELMENTION\%+/g, message.channel).replace(/\%DELETE\%/g, "").replace(/\%CHANNELNAME\%/g, message.channel.name);
      if (output.includes("%DELETE%"))
          message.delete().catch(() => { });
      message.guild.channels.forEach(channel => {
          if (output.includes(`{${channel.name}}`)) {
              var re = new RegExp(channel.name, "g");
              newoutput = newoutput.replace(/\{/g, '').replace(/\}/g, '').replace(re, channel);
          }
      });
      message.guild.roles.forEach(role => {
          if (output.includes(`{^${role.name}}`)) {
              var re = new RegExp(role.name, "g");
              newoutput = newoutput.replace(/\{/g, '').replace(/\}/g, '').replace(/\^/g, '').replace(re, role);
          }
      });
      bot.commands.forEach(command => {
          if (output.includes(`{!${command.config.name}}`)) {
              var re = new RegExp(command.config.name, "g");
              newoutput = newoutput.replace(/\{/g, '').replace(/\}/g, '').replace(/\!/g, '').replace(re, '');
              increment();
              if (cc >= 3) return;
              command.run(bot, message, args, new funcs(message), con);
          }
      });
      if (newoutput.length >= 1) {
          message.channel.send(newoutput.trim());
      }
      cc = 0;
  });
}

function handleCustomResponses(message, con, command, bot, funcs, args) {
  const responseFix = message.content.replace(/\"/g);
        con.query(`SELECT * FROM guildCustomResponses WHERE guildCustomResponses.guildId ="${message.guild.id}" AND response_name ="${responseFix}"`, (e, row) => {
            if (!row || row.length == 0) return;
            row = row[0];
            const output = row.response_output;
            let newoutput = output.replace(/\%NAME\%/g, message.author.username).replace(/\%PING\%/g, message.member).replace(/\%AUTHORID\%/g, message.author.id).replace(/\%MEMBERGAME\%/g, message.author.presence.game === null ? "none" : message.author.presence.game.name).replace(/\%MEMBERSTATUS\%+/g, message.author.presence.status).replace(/\%MEMBERNICK\%+/g, message.member.nickname !== null ? message.member.nickname : "none").replace(/\%MEMBERJOINED\%+/g, message.member.joinedAt.toDateString()).replace(/\%ROLENAME\%+/g, message.member.highestRole.name).replace(/\%SERVERID\%+/g, message.guild.id).replace(/\%GUILDNAME\%/g, message.guild.name).replace(/\%GUILDREGION\%/g, message.guild.region).replace(/\%MEMBERCOUNT\%/g, message.guild.members.size).replace(/\%OWNERID\%/g, message.guild.owner.id).replace(/\%CHANNELID\%/g, message.channel.id).replace(/\%CHANNELMENTION\%/g, message.channel).replace(/\%DELETE\%/g, "").replace(/\%CHANNELNAME\%/g, message.channel.name);
            if (output.includes("%DELETE%"))
                message.delete().catch(() => { });
            message.guild.channels.forEach(channel => {
                if (output.includes(`{${channel.name}}`)) {
                    var re = new RegExp(channel.name, "g");
                    newoutput = newoutput.replace(/\{/g, '').replace(/\}/g, '').replace(re, channel);
                }
            });
            message.guild.roles.forEach(role => {
                if (output.includes(`{^${role.name}}`)) {
                    var re = new RegExp(role.name, "g");
                    newoutput = newoutput.replace(/\{/g, '').replace(/\}/g, '').replace(/\^/g, '').replace(re, role);
                }
            });
            bot.commands.forEach(command => {
                if (output.includes(`{!${command.config.name}}`)) {
                    var re = new RegExp(command.config.name, "g");
                    newoutput = newoutput.replace(/\{/g, '').replace(/\}/g, '').replace(/\!/g, '').replace(re, '');
                    increment();
                    if (cc >= 3) return;
                    command.run(bot, message, args, new funcs(message), con);
                }
            });
            message.channel.send(newoutput.trim());
        });
}

async function handleDCIC(message, con, command) {
  let isDisabled;
  await con.query(`SELECT * FROM disabledCommandsInChannels WHERE guildId ="${message.guild.id}" AND command ="${command}" AND channel ="${message.channel.name}"`, (e, row) => {
      message.channel.send(row[0].command);
      if (row !== undefined || row.length >= 1) {
          message.channel.send('disabled')
          isDisabled = "true";
      } else {
          isDisabled = "false";
      }
  });
  return isDisabled;
}

function handleCommandCooldown(command, message, commandCoolDown, funcs) {
  const ms = require('ms');
  if (commandCoolDown !== undefined) {
      if (usedCommandRecently.has(`${message.author.id}(${command})`)) {
          const time = ms(parseInt(commandCoolDown) * 1000);
          funcs.send(`That command is on cooldown for ${time}! Please wait and try again!`);
          return "cooldown";
      }
      usedCommandRecently.add(`${message.author.id}(${command})`);
      setTimeout(() => {
          usedCommandRecently.delete(`${message.author.id}(${command})`);
      }, commandCoolDown * 1000);
  }
}

function handleLeveling(message, member) {
  const funcs = new Funcs(message);
  const ms = require('ms');
  con.query(`SELECT * FROM guildLeveling WHERE guildId ="${message.guild.id}" AND userId ="${member.id}"`, (e, row2) => {
      con.query(`SELECT levelingDisplayMode FROM guildSettings WHERE guildId ="${message.guild.id}"`, async (e, row1) => {
          let xptoget = row2.length == 0 ? 400 : row2[0].userLevel * 400;
          let xptogive = Math.floor(Math.random() * 25) + 5;
          if (cooldown.has(`${message.author.id}:${message.guild.id}`)) return;
          if (row2.length == 0) {
              con.query(`INSERT INTO guildLeveling (guildId, userId, userPrestige, userLevel, userXP, hasRecievedXP, username, userRank) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 0, 1, xptogive, "false", member.user.username, "Member"]);
              cooldown.add(`${message.author.id}:${message.guild.id}`);
          } else {
              row2 = row2[0];
              row1 = row1[0];
              con.query(`UPDATE guildLeveling SET userXP = ${row2.userXP + xptogive} WHERE guildId = ${message.guild.id} AND userId = ${member.id}`, async () => {
                  cooldown.add(`${message.author.id}:${message.guild.id}`);
                  if (row2.userXP >= xptoget && row1.levelingDisplayMode == "image") {
                      con.query(`UPDATE guildLeveling SET userLevel = ${row2.userLevel + 1} WHERE guildId = ${message.guild.id} AND userId = ${member.id}`, async () => {
                          const username_fix = message.author.username.substr(0, 30);
                          const request = require('node-superfetch');
                          const {
                              Canvas
                          } = require('canvas-constructor');
                          const fsn = require("fs-nextra");
                          const getSlapped = async (person) => {
                              const plate = await fsn.readFile('./assets/images/level_up.png');
                              const png = person.replace('.gif', '.png');
                              const {
                                  body
                              } = await request.get(png);
                              return new Canvas(640, 360)
                                  .addImage(plate, 0, 0, 640, 360)
                                  .setTextFont('23px Srisakdi')
                                  .setTextAlign("center")
                                  .addText(username_fix, 350, 60)
                                  .setTextFont('26px Srisakdi')
                                  .setTextAlign("center")
                                  .addText(row2.userLevel + 1, 456, 201)
                                  .setTextFont('26px Srisakdi')
                                  .setTextAlign("center")
                                  .addText(row2.userXP + "/" + row2.userLevel * 400, 426, 271)
                                  .addImage(body, 58, 80, 200, 200, { type: 'round', radius: 100 })
                                  .resetTransformation()
                                  .toBuffer();
                          };
                          try {
                              const person = message.author.avatarURL;
                              const result = await getSlapped(person);
                              await message.channel.send({
                                  files: [{
                                      attachment: result,
                                      name: 'levelup.png'
                                  }]
                              }).then(msg => msg.delete(25000));
                          } catch (error) {
                              throw error;
                          }
                      });
                  } else if (row2.userXP >= xptoget && row1.levelingDisplayMode == "text") {
                      con.query(`UPDATE guildLeveling SET userLevel = ${row2.userLevel + 1} WHERE guildId = ${message.guild.id} AND userId = ${member.id}`, () => {
                          con.query(`SELECT * FROM guildLeveling WHERE guildId ="${message.guild.id}" ORDER BY userLevel DESC LIMIT 1`, (e, highestUser) => {
                              highestUser = highestUser[0];
                              let levelsNeeded;
                              if (highestUser.userId == message.author.id) levelsNeeded = "Already #1!";
                              else levelsNeeded = highestUser.userLevel - (row2.userLevel + 1);
                              const { RichEmbed } = require('discord.js');
                              const embed = new RichEmbed()
                                  .setColor(funcs.rc())
                                  .setDescription(`Leveled up to: ${row2.userLevel + 1}`)
                                  .setTitle(`${message.author.username} has leveled up!`)
                                  .addField(`Levels needed to be #1:`, levelsNeeded);
                              message.channel.send(embed).then((response) => {
                                  response.delete(10000);
                              });
                          });
                      });
                  }
              });
              setTimeout(() => {
                  cooldown.delete(`${message.author.id}:${message.guild.id}`);
              }, ms("1m"));
          }
      });
  });
}