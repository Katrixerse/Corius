//const mfuncs = require("../../assets/exports/funcs.js");
const { RichEmbed } = require('discord.js');
const permissionNeeded = "BAN_MEMBERS";
const ms = require('ms');
const Funcs = require('./../exports/funcs');
const addEntry = require('./../exports/addDbEntry');
const { dbConnect } = require('./dbConnection.js');

let con;
con = dbConnect();

module.exports = {
  updateCaseNumber: (con, row) => {
    con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
  },
  antiInvites: (row, mods, member, me, message, ignoreChannel, ignoreRole) => {
    const funcs = new Funcs(message);
    if (ignoreChannel.includes(message.channel.name)) return;
    if (member.hasPermission(permissionNeeded, false, true, true) || mods.includes(message.author.id)) return;
    if (member.highestRole.position >= me.highestRole.position) return;
    let regx = /^((?:discord\.gg|discordapp\.com))/g;
    let hasInvites = regx.test(message.content.toLowerCase());
    if (hasInvites) {
      message.delete();
      const date = Date.now();
      let embed = new RichEmbed()
        .setTitle(`Auto Moderation`)
        .setColor(funcs.rc())
        .setTimestamp()
        .addField(`Message:`, message.content)
        .addField(`Author:`, member.user.tag)
        .addField(`Time took to delete:`, ms(Date.now() - date))
        .addField(`Reason deleted:`, `Contains invites.`);
      let f = message.guild.channels.find(c => c.name.toLowerCase() == row.logsChannel.toLowerCase());
      if (row.warnOnAutoMod == 'true') {
        con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row2) => {
          if (!row2 || row2.length == 0) {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-invites)', new Date().toDateString(), 'Corius', message.author.username, 1]);
          } else {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-invites)', new Date().toDateString(), 'Corius', message.author.username, row2[0].warnCount + 1]);
          }
        });
        con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row3) => {
          if (row3.length == 0) {
            addEntry.addDbEntryUserId(message.guild.id, message.author.id, 'warn');
          } else {
            row3 = row3[0];
            con.query(`UPDATE userPunishments SET warnings = ${row3.warnings + 1} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
          }
        });
      }
      if (row.logsEnabled == "false") return;
      if (!f) return;
      message.guild.channels.get(f.id).send(embed);
    }
  },
  antiWebLink: (row, mods, member, me, message, ignoreChannel, ignoreRole) => {
    const funcs = new Funcs(message);
    if (ignoreChannel.includes(message.channel.name)) return;
    //if (ignoreRole.includes(member.roles.map(r => r.name).join(' '))) return; not working plz fix sometime
    if (member.hasPermission(permissionNeeded, false, true, true) || mods.includes(message.author.id)) return;
    if (member.highestRole.position >= me.highestRole.position) return;
    let regx = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    let hasLinks = regx.test(message.content.toLowerCase());
    if (hasLinks) {
      message.delete();
      const date = Date.now();
      let embed = new RichEmbed()
        .setTitle(`Auto Moderation`)
        .setColor(funcs.rc())
        .setTimestamp()
        .addField(`Message:`, message.content)
        .addField(`Author:`, member.user.tag)
        .addField(`Time took to delete:`, ms(Date.now() - date))
        .addField(`Reason deleted:`, `Contains web link.`);
      let f = message.guild.channels.find(c => c.name.toLowerCase() == row.logsChannel.toLowerCase());
      if (row.warnOnAutoMod == 'true') {
        con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row2) => {
          if (!row2 || row2.length == 0) {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-weblinks)', new Date().toDateString(), 'Corius', message.author.username, 1]);
          } else {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-weblinks)', new Date().toDateString(), 'Corius', message.author.username, row2[0].warnCount + 1]);
          }
        });
        con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row3) => {
          if (row3.length == 0) {
            addEntry.addDbEntryUserId(message.guild.id, message.author.id, 'warn');
          } else {
            row3 = row3[0];
            con.query(`UPDATE userPunishments SET warnings = ${row3.warnings + 1} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
          }
        });
      }
      if (row.logsEnabled == "false") return;
      if (!f) return;
      message.guild.channels.get(f.id).send(embed);
    }
  },
  asciiProtection: (row, mods, member, me, message, ignoreChannel, ignoreRole) => {
    const funcs = new Funcs(message);
    if (ignoreChannel.includes(message.channel.name)) return;
    if (member.hasPermission(permissionNeeded, false, true, true) || mods.includes(message.author.id)) return;
    if (member.highestRole.position >= me.highestRole.position) return;
    let hasInvites = /[^\x00-\x7F]/;
    let result = hasInvites.test(message.content);
    if (result == true) {
      message.delete();
      const date = Date.now();
      let embed = new RichEmbed()
        .setTitle(`Auto Moderation`)
        .setColor(funcs.rc())
        .setTimestamp()
        .addField(`Message:`, message.content)
        .addField(`Author:`, member.user.tag)
        .addField(`Time took to delete:`, ms(Date.now() - date))
        .addField(`Reason deleted:`, `Contains ASCII characters.`);
      let f = message.guild.channels.find(c => c.name.toLowerCase() == row.logsChannel.toLowerCase());
      if (row.warnOnAutoMod == 'true') {
        con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row2) => {
          if (!row2 || row2.length == 0) {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (ASCII)', new Date().toDateString(), 'Corius', message.author.username, 1]);
          } else {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (ASCII)', new Date().toDateString(), 'Corius', message.author.username, row2[0].warnCount + 1]);
          }
        });
        con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row3) => {
          if (row3.length == 0) {
            addEntry.addDbEntryUserId(message.guild.id, message.author.id, 'warn');
          } else {
            row3 = row3[0];
            con.query(`UPDATE userPunishments SET warnings = ${row3.warnings + 1} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
          }
        });
      }
      if (row.logsEnabled == "false") return;
      if (!f) return;
      message.guild.channels.get(f.id).send(embed);
    }
  },
  antiCapsLock: (row, mods, member, me, message, ignoreChannel, ignoreRole) => {
    const funcs = new Funcs(message);
    if (ignoreChannel.includes(message.channel.name)) return;
    if (member.hasPermission(permissionNeeded, false, true, true) || mods.includes(message.author.id)) return;
    if (member.highestRole.position >= me.highestRole.position) return;
    let stringCount = message.content.length;
    if (stringCount <= 4) return;
    let hasDupes = message.content.replace(/[^A-Z]/g, "").length;
    let getPercent = (hasDupes / stringCount);
    if (getPercent >= 0.25) {
      message.delete();
      const date = Date.now();
      let embed = new RichEmbed()
        .setTitle(`Auto Moderation`)
        .setColor(funcs.rc())
        .setTimestamp()
        .addField(`Message:`, message.content)
        .addField(`Author:`, member.user.tag)
        .addField(`Time took to delete:`, ms(Date.now() - date))
        .addField(`Reason deleted:`, `Contains CapsLock characters.`);
      let f = message.guild.channels.find(c => c.name.toLowerCase() == row.logsChannel.toLowerCase());
      if (row.warnOnAutoMod == 'true') {
        con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row2) => {
          if (!row2 || row2.length == 0) {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-capslock)', new Date().toDateString(), 'Corius', message.author.username, 1]);
          } else {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-capslock)', new Date().toDateString(), 'Corius', message.author.username, row2[0].warnCount + 1]);
          }
        });
        con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row3) => {
          if (row3.length == 0) {
            addEntry.addDbEntryUserId(message.guild.id, message.author.id, 'warn');
          } else {
            row3 = row3[0];
            con.query(`UPDATE userPunishments SET warnings = ${row3.warnings + 1} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
          }
        });
      }
      if (row.logsEnabled == "false") return;
      if (!f) return;
      message.guild.channels.get(f.id).send(embed);
    }
  },
  antidupChars: (row, mods, member, me, message, ignoreChannel, ignoreRole) => {
    const funcs = new Funcs(message);
    if (ignoreChannel.includes(message.channel.name)) return;
    if (member.hasPermission(permissionNeeded, false, true, true) || mods.includes(message.author.id)) return;
    if (member.highestRole.position >= me.highestRole.position) return;
    let stringCount = message.content.length;
    if (stringCount <= 4) return;
    let hasDupes = /([a-zA-Z])\1+$/;
    let StringCheck = message.content.split('');
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);
    let result = hasDupes.test(message.content);
    if (result == true && findDuplicates(StringCheck).length >= 5) {
      message.delete();
      const date = Date.now();
      let embed = new RichEmbed()
        .setTitle(`Auto Moderation`)
        .setColor(funcs.rc())
        .setTimestamp()
        .addField(`Message:`, message.content)
        .addField(`Author:`, member.user.tag)
        .addField(`Time took to delete:`, ms(Date.now() - date))
        .addField(`Reason deleted:`, `Contains duplicate characters.`);
      let f = message.guild.channels.find(c => c.name.toLowerCase() == row.logsChannel.toLowerCase());
      if (row.warnOnAutoMod == 'true') {
        con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row2) => {
          if (!row2 || row2.length == 0) {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-dupchars)', new Date().toDateString(), 'Corius', message.author.username, 1]);
          } else {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-dupchars)', new Date().toDateString(), 'Corius', message.author.username, row2[0].warnCount + 1]);
          }
        });
        con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row3) => {
          if (row3.length == 0) {
            addEntry.addDbEntryUserId(message.guild.id, message.author.id, 'warn');
          } else {
            row3 = row3[0];
            con.query(`UPDATE userPunishments SET warnings = ${row3.warnings + 1} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
          }
        });
      }
      if (row.logsEnabled == "false") return;
      if (!f) return;
      message.guild.channels.get(f.id).send(embed);
    }
  },
  antiPings: (row, mods, member, me, message, ignoreChannel, ignoreRole) => {
    const funcs = new Funcs(message);
    if (ignoreChannel.includes(message.channel.name)) return;
    if (member.hasPermission(permissionNeeded, false, true, true) || mods.includes(message.author.id)) return;
    if (member.highestRole.position >= me.highestRole.position) return;
    /*var hasUserPings = message.mentions.users;
    var hasRolePings = message.mentions.roles;
    const hasPings = hasUserPings.concat(hasRolePings);
    console.log(hasPings)
    console.log(hasPings.size)
    if (hasPings.size <= 2) return; */
    if (message.mentions.everyone == true) {
      message.delete();
      y = 0;
      const date = Date.now();
      let embed = new RichEmbed()
        .setTitle(`Auto Moderation`)
        .setColor(funcs.rc())
        .setTimestamp()
        .addField(`Message:`, message.content)
        .addField(`Author:`, member.user.tag)
        .addField(`Time took to delete:`, ms(Date.now() - date))
        .addField(`Reason deleted:`, `Contains CapsLock characters.`);
      let f = message.guild.channels.find(c => c.name.toLowerCase() == row.logsChannel.toLowerCase());
      if (row.warnOnAutoMod == 'true') {
        con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row2) => {
          if (!row2 || row2.length == 0) {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-pings)', new Date().toDateString(), 'Corius', message.author.username, 1]);
          } else {
            con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-pings)', new Date().toDateString(), 'Corius', message.author.username, row2[0].warnCount + 1]);
          }
        });
        con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row3) => {
          if (row3.length == 0) {
            addEntry.addDbEntryUserId(message.guild.id, message.author.id, 'warn');
          } else {
            row3 = row3[0];
            con.query(`UPDATE userPunishments SET warnings = ${row3.warnings + 1} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
          }
        });
      }
      if (row.logsEnabled == "false") return;
      if (!f) return;
      message.guild.channels.get(f.id).send(embed);
    }
  },
  antiSelfbot: (row, mods, member, me, message, ignoreChannel, ignoreRole) => {
    const funcs = new Funcs(message);
    if (ignoreChannel.includes(message.channel.name)) return;
    if (member.hasPermission(permissionNeeded, false, true, true) || mods.includes(message.author.id)) return;
    if (member.highestRole.position >= me.highestRole.position) return;
    for (var i = 0; i < message.embeds.length; i++) {
      if (message.embeds[i].title.includes("") && !message.author.bot) {
        message.delete();
        const date = Date.now();
        let embed = new RichEmbed()
          .setTitle(`Auto Moderation`)
          .setColor(funcs.rc())
          .setTimestamp()
          .addField(`Message:`, message.content)
          .addField(`Author:`, member.user.tag)
          .addField(`Time took to delete:`, ms(Date.now() - date))
          .addField(`Reason deleted:`, `Contains CapsLock characters.`);
        let f = message.guild.channels.find(c => c.name.toLowerCase() == row.logsChannel.toLowerCase());
        if (row.warnOnAutoMod == 'true') {
          con.query(`SELECT * FROM userWarns WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, (e, row2) => {
            if (!row2 || row2.length == 0) {
              con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-selfbot)', new Date().toDateString(), 'Corius', message.author.username, 1]);
            } else {
              con.query(`INSERT INTO userWarns (guildId, userId, warning, warnedAt, warnedBy, username, warnCount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [message.guild.id, message.author.id, 'Auto-moderation (Anti-selfbot)', new Date().toDateString(), 'Corius', message.author.username, row2[0].warnCount + 1]);
            }
          });
          con.query(`SELECT * FROM userPunishments WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`, async (e, row3) => {
            if (row3.length == 0) {
              addEntry.addDbEntryUserId(message.guild.id, message.author.id, 'warn');
            } else {
              row3 = row3[0];
              con.query(`UPDATE userPunishments SET warnings = ${row3.warnings + 1} WHERE guildId = ${message.guild.id} AND userId = ${message.author.id}`);
            }
          });
        }
        if (row.logsEnabled == "false") return;
        if (!f) return;
        message.guild.channels.get(f.id).send(embed);
      }
    }
  }
};