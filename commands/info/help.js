const fs = require('fs');
const {
  promisify
} = require('util');
const readdir = promisify(fs.readdir);
const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, funcs, con) => {
  try {
    function decideWhereToSend(helpDestination, commandList, message, funcs) {
      let commandlist1;
      let commandlist2;
      let commandlist3;
      let pages = 1;
      if (commandList.length > 20) {
        commandlist1 = commandList.slice(0, 20);
      }
      if (commandList.length > 40) {
        commandlist2 = commandList.slice(20, 40);
        pages += 1;
      }
      if (commandList.length > 60) {
        commandlist3 = commandList.slice(40, 60);
        pages += 1;
      }
      const commandlist = commandList.length > 20 ? undefined : commandList.join("\n\n");
      const embed = new MessageEmbed()
        .setTitle(`Command List`)
        .setAuthor(`${commandList.length} commands.`)
        .setColor(funcs.rc())
        .setThumbnail(bot.user.avatarURL)
        .setDescription(!commandlist ? commandlist1.join("\n\n") : commandlist)
        .setTitle(`Enter the number of the page to navigate to it`)
        .setFooter(`Page 1/${pages}`);
      if (helpDestination === "channel") {
        let n = 0;
        message.channel.send(embed).then((m) => {
          var interval;
          var reload = async function () {
            if (n > 4) {
              funcs.send(`Too many page refreshes! Command canceled!`);
              return clearInterval(interval);
            }
            interval = await setInterval(() => {
              message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                errors: ["time"],
                time: 30000
              }).then(response => {
                response = response.array()[0];
                if (response.content !== "1" && response.content !== "2" && response.content !== "3") {
                  clearInterval(interval);
                  funcs.send(`No page number specified. Command canceled!`);
                } else if (parseInt(response.content) > pages || parseInt(response.content) <= 0) {
                  clearInterval(interval);
                  funcs.send(`Not a valid page number. Command canceled!`);
                } else {
                  if (response.deletable) response.delete();
                  response = response.content;
                  function pickCommandList() {
                    if (response == "1") {
                      return commandlist1;
                    } else if (response == "2") {
                      return commandlist2;
                    } else if (response == "3") {
                      return commandlist3;
                    }
                  }
                  const embed = new MessageEmbed()
                    .setTitle(`Command List`)
                    .setAuthor(`${commandList.length} commands.`)
                    .setColor(funcs.rc())
                    .setThumbnail(bot.user.avatarURL)
                    .setDescription(!commandlist ? pickCommandList().join("\n\n") : commandlist)
                    .setTitle(`Enter the number of the page to navigate to it.`)
                    .setFooter(`Page ${response}/${pages}`);
                  m.edit(embed);
                  clearInterval(interval);
                  n += 1;
                  if (n > 4) {
                    funcs.send(`Too many page refreshes! Command canceled!`);
                    return clearInterval(interval);
                  }
                  reload();
                }
              }).catch((e) => {
                console.log(e);
                clearInterval(interval);
                funcs.send(`You ran out of time!`);
              });
              clearInterval(interval);
            }, require('ms')('1ms'));
          }
          reload();
        });
      } else {
        funcs.send(`Help is on its way!`);
        let n = 0;
        message.author.createDM().then(channel => {
          channel.send(embed).then((m) => {
            var interval;
            var reload = async function () {
              if (n > 6) {
                funcs.send(`Too many page refreshes! Command canceled!`);
                return clearInterval(interval);
              }
              interval = await setInterval(() => {
                channel.awaitMessages(m => m.author.id === message.author.id, {
                  max: 1,
                  errors: ["time"],
                  time: 30000
                }).then(response => {
                  response = response.array()[0];
                  if (response.content !== "1" && response.content !== "2" && response.content !== "3") {
                    clearInterval(interval);
                    channel.send(`**__No page number specified. Command canceled!__**`);
                  } else if (parseInt(response.content) > pages || parseInt(response.content) <= 0) {
                    clearInterval(interval);
                    channel.send(`**__Not a valid page number. Command canceled!__**`);
                  } else {
                    if (response.deletable) response.delete();
                    response = response.content;
                    function pickCommandList() {
                      if (response == "1") {
                        return commandlist1;
                      } else if (response == "2") {
                        return commandlist2;
                      } else if (response == "3") {
                        return commandlist3;
                      }
                    }
                    const embed = new MessageEmbed()
                      .setTitle(`Command List`)
                      .setAuthor(`${commandList.length} commands.`)
                      .setColor(funcs.rc())
                      .setThumbnail(bot.user.avatarURL)
                      .setDescription(!commandlist ? pickCommandList().join("\n\n") : commandlist)
                      .setTitle(`Enter the number of the page to navigate to it.`)
                      .setFooter(`Page ${response}/${pages}`);
                    m.edit(embed);
                    clearInterval(interval);
                    n += 1;
                    if (n > 4) {
                      funcs.send(`Too many page refreshes! Command canceled!`);
                      return clearInterval(interval);
                    }
                    reload();
                  }
                }).catch((e) => {
                  console.log(e);
                  clearInterval(interval);
                  channel.send(`**__You ran out of time!__**`);
                });
                clearInterval(interval);
              }, require('ms')('1ms'));
            }
            reload();
          });
        }).catch(() => funcs.send(`Failed to send you the commands list in dms, you may have dms turned off.`));
      }
    }
    message.channel.send(`**__What would you like to do?__**\n\`\`\`Help sent to dm (type dm)\nHelp sent to channel (type channel)\n\nType exit to cancel.\`\`\``)
      .then(() => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
          max: 1,
          time: 30000,
          errors: ['time'],
        })
          .then(async (resp) => {
            if (!resp) return;
            resp = resp.array()[0];
            if (resp.content !== 'dm' && resp.content !== 'channel') return message.channel.send('Did not pick a valid option (options: dm or channel)')
            let helpDestination = resp.content;
            message.channel.send(`**__Which command category would you like to see?__**\n\`\`\`See the fun commands (type fun)\nSee the moderation commands (type mod)\nSee the economy commands (type economy)\nSee the roleplay commands (type roleplay)\nSee the reddit commands (type reddit)\nSee the canvas commands (type canvas)\nSee the nsfw commands (type nsfw)\nSee the info commands (type info)\nSee the miscellaneous commands (type miscellaneous)\nSee the search commands (type search)\nSee the music commands (type music)\nSee the leveling commands (type leveling)\nType exit to cancel.\`\`\``)
              .then(() => {
                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                  max: 1,
                  time: 30000,
                  errors: ['time'],
                })
                  .then(async (resp) => {
                    if (!resp) return;
                    resp = resp.array()[0];
                    if (resp.content.toLowerCase().includes("fun")) {
                      const funFiles = await readdir("./commands/fun/");
                      let commandList = funFiles.map(file => `${require(`./../fun/${file}`).config.name}: ${require(`./../fun/${file}`).config.usage}\nAliases: ${require(`./../fun/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("mod")) {
                      const mod = await readdir("./commands/moderation/");
                      let commandList = mod.map(file => `${require(`./../moderation/${file}`).config.name}: ${require(`./../moderation/${file}`).config.usage}\nAliases: ${require(`./../moderation/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("roleplay")) {
                      const role = await readdir("./commands/roleplay/");
                      let commandList = role.map(file => `${require(`./../roleplay/${file}`).config.name}: ${require(`./../roleplay/${file}`).config.usage}\nAliases: ${require(`./../roleplay/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("info")) {
                      const info = await readdir("./commands/info/");
                      let commandList = info.map(file => `${require(`./../info/${file}`).config.name}: ${require(`./../info/${file}`).config.usage}\nAliases: ${require(`./../info/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("economy")) {
                      const economy = await readdir("./commands/economy/");
                      let commandList = economy.map(file => `${require(`./../economy/${file}`).config.name}: ${require(`./../economy/${file}`).config.usage}\nAlias: ${require(`./../economy/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("nsfw")) {
                      const nsfw = await readdir("./commands/nsfw/");
                      let commandList = nsfw.map(file => `${require(`./../nsfw/${file}`).config.name}: ${require(`./../nsfw/${file}`).config.usage}\nAliases: ${require(`./../nsfw/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("reddit")) {
                      const reddit = await readdir("./commands/reddit/");
                      let commandList = reddit.map(file => `${require(`./../reddit/${file}`).config.name}: ${require(`./../reddit/${file}`).config.usage}\nAliases: ${require(`./../reddit/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("canvas")) {
                      const canvas = await readdir("./commands/canvas/");
                      let commandList = canvas.map(file => `${require(`./../canvas/${file}`).config.name}: ${require(`./../canvas/${file}`).config.usage}\nAliases: ${require(`./../canvas/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("leveling")) {
                      const leveling = await readdir("./commands/leveling/");
                      let commandList = leveling.map(file => `${require(`./../leveling/${file}`).config.name}: ${require(`./../leveling/${file}`).config.usage}\nAliases: ${require(`./../leveling/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("search")) {
                      const search = await readdir("./commands/search/");
                      let commandList = search.map(file => `${require(`./../search/${file}`).config.name}: ${require(`./../search/${file}`).config.usage}\nAliases: ${require(`./../search/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("music")) {
                      const music = await readdir("./commands/music/");
                      let commandList = music.map(file => `${require(`./../music/${file}`).config.name}: ${require(`./../music/${file}`).config.usage}\nAliases: ${require(`./../music/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    } else if (resp.content.toLowerCase().includes("miscellaneous")) {
                      const misc = await readdir("./commands/canvas/");
                      let commandList = misc.map(file => `${require(`./../miscellaneous/${file}`).config.name}: ${require(`./../miscellaneous/${file}`).config.usage}\nAliases: ${require(`./../miscellaneous/${file}`).config.aliases.map(a => a).join(",")}`);
                      decideWhereToSend(helpDestination, commandList, message, funcs);
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                    funcs.send(`Time has expired.`);
                  });
              });
          });
      });
  } catch (e) {
    console.error;
    funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
  }
};

module.exports.config = {
  name: "help",
  aliases: [],
  usage: "Use this command to get help.",
  commandCategory: "info",
  cooldownTime: '0'
};
