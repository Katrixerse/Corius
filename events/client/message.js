const funcs = require("../../handlers/funcs.js");
const messFuncs = require("../../handlers/messageHandler.js");
const { dbConnect } = require('./../../handlers/dbConnection.js');

let con;
con = dbConnect();

let prefix;

module.exports = async (bot, message) => {
  if (message.author.bot || message.channel.type === "dm") return;
  con.query(`SELECT gp.prefix, gs.modOnly, gs.levelingEnabled, gs.economyEnabled, gds.commands, gds.categories FROM guildPrefix AS gp LEFT JOIN guildSettings as gs ON gp.guildId = gs.guildId LEFT JOIN guildDisabledSettings AS gds ON gp.guildId = gds.guildId WHERE gp.guildId ="${message.guild.id}"`, async (e, row) => {
    con.query(`SELECT userId AS afkId, guildId, isAfk, afkReason FROM afk AS a WHERE guildId ='${message.guild.id}'`, async (e, rows) => {
      con.query(`SELECT * FROM guildModerators WHERE guildId = '${message.guild.id}'`, async (e, mods) => {
        con.query(`SELECT * FROM guildBlacklistedUsers WHERE guildId ="${message.guild.id}" AND user ="${message.author.id}"`, async (e, user) => {
          row = row[0];
          prefix = row != null ? row[0].prefix : 'k!';
          const args = message.content
            .slice(row.prefix.length)
            .trim()
            .split(/ +/g);
          let command = args.shift();
          con.query(`SELECT * FROM disabledCommandsInChannels WHERE guildId ="${message.guild.id}" AND command ="${command}" AND channel ="${message.channel.name}"`, async (e, row1) => {
            if (!message.content.startsWith(row.prefix)) {
              //* Prefix reset
              if (message.content.startsWith(`<@${bot.user.id}> prefix` || `<@!${bot.user.id}> prefix`)) {
                message.channel.send(`__**Prefix has been successfully resetted to "c!"!**__`);
                con.query(`UPDATE guildPrefix SET prefix ="c!" WHERE guildId = ${message.guild.id}`);
              }
              messFuncs.handleMessagesBeforePrefix(message, row, user[0], command, bot, new funcs(message), args, rows, con);
              return;
            }
            messFuncs.handleMessages(message, row, user[0], command, bot, funcs, args, con);
            command = command.toLowerCase();
            //* Modonly & others
            const thing = await messFuncs.handleAwaits(message, row, user[0], command, bot, new funcs(message), args, con);
            if (thing == "cooldown" || thing == "blacklisted") return;
            if (!row1) {
              return;
            }
            const modz = mods == undefined || mods.length == 0 ? "none" : mods.map(r => r.guildMods == message.author.id);
            if (!modz.includes(message.author.id) && row.modOnly == "true" && !message.member.hasPermission(`BAN_MEMBERS`, false, true, true)) return;
            let commandFile;
            if (bot.commands.has(command)) {
              commandFile = bot.commands.get(command);
            } else if (bot.aliases.has(command)) {
              commandFile = bot.commands.get(bot.aliases.get(command));
            } else {

            }
            //* Alias checking
            if (bot.aliases.has(command)) {
              const isAlias = bot.commands.get(bot.aliases.get(command)).config.name;
              if (isAlias !== undefined && row.commands.toLowerCase().includes(isAlias)) return;
            }
            if (row.commands.toLowerCase().includes(command)) return;
            if (commandFile !== undefined && !bot.aliases.has(command) && row.categories.includes(bot.commands.get(command).config.commandCategory)) {
              if (row.categories.includes(bot.commands.get(command).config.commandCategory)) return;
            } else if (bot.aliases.has(command)) {
              const aliasCommand = bot.commands.get(bot.aliases.get(command));
              if (row.categories.includes(aliasCommand.config.commandCategory)) return;
            }
            if (commandFile) {
              console.log(`[(${message.guild.me.user.username}) (${message.guild.name}) (${message.author.username}) (${command}) (${args.length == 0 ? "No args detected." : args})]`);
              commandFile.run(bot, message, args, new funcs(message), con);
            }
          });
        });
      });
    });
  });
};
