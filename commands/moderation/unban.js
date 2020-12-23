const { richEmbed } = require("discord.js");

module.exports.run = (bot, message, args, funcs, con) => {
  if (!message.member.hasPermission(`BAN_MEMBERS`, false, true, true)) return funcs.send(`You need the BAN_MEMBERS permission to use this command!`);
  if (!message.guild.me.hasPermission(`BAN_MEMBERS`)) return funcs.send(`I need the BAN_MEMBERS permission to execute this command!`);
  message.guild.fetchBans().then(users => {
    if (users.size == 0) return funcs.send(`There are no banned users in this guild!`);
    const embed = new richEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setColor(funcs.rc())
      .setDescription(`Which user would you like to unban? (enter the number)`)
      .setFooter(bot.user.username)
      .setThumbnail(bot.user.avatarURL);
    let n = 0;
    users.forEach(user => {
      embed.addField(`${n += 1}#:`, `${user.username} (ID: ${user.id})`);
    });
    n = 0;
    message.channel.send(embed).then(() => {
      message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        errors: ["time"],
        time: 30000
      }).then((response) => {
        const numberPicked = parseInt(response.array()[0].content);
        if (isNaN(numberPicked)) return funcs.send(`Not a valid number!`, true);
        if (numberPicked <= 0 || numberPicked > users.size) return funcs.send(`Not a valid number!`);
        embed.fields.forEach(field => {
          if (field.name.startsWith(numberPicked)) {
            const userPicked = field.value.split(" ")[0];
            const userID = field.value.split(userPicked).join("").split(" ")[2].split(")").join("");
            message.guild.unban(userID).then(() => {
              funcs.send(`User successfully unbanned!`);
              con.query(`SELECT gs.logsEnabled, gs.logsChannel, gc.caseNumber FROM guildSettings AS gs LEFT JOIN guildCasenumber as gc ON gc.guildId = gs.guildId WHERE gs.guildId="${message.guild.id}"`, (e, row) => {
                row = row[0];
                con.query(`UPDATE guildCasenumber SET caseNumber = ${row.caseNumber + 1} WHERE guildId = ${message.guild.id}`);
                const LogsEmbed = new richEmbed()
                  .setTitle(`:hammer: Member Unbanned :hammer:`)
                  .setAuthor(message.author.tag, message.author.avatarURL)
                  .addField(`Member unbanned:`, userPicked)
                  .addField(`Unbanned by:`, message.author.username)
                  .addField(`Unbanned at:`, new Date().toDateString())
                  .addField(`Casenumber:`, `#${row.caseNumber + 1}`)
                  .setColor(funcs.rc())
                  .setFooter(bot.user.username);
                if (row.logsEnabled !== "true") return;
                const logsChannel = message.guild.channels.find(c => c.name === row.logsChannel);
                if (logsChannel === undefined) return;
                message.guild.channels.get(logsChannel.id).send(LogsEmbed);
              });
            }).catch((e) => {
              funcs.send(`An error occurred! ${e.message}`);
              console.log(`Error: ${e.message} in guild ${message.guild.name} command unban`);
            });
          }
        });
      }).catch((e) => {
        funcs.send(`You ran out of time or an error occured!`);
        console.log(`Error: ${e.message} in guild ${message.guild.name} command unban`);
      });
    });
  });
};

module.exports.config = {
  name: "unban",
  aliases: [],
  usage: "Unbans a user.",
  commandCategory: "moderation",
  cooldownTime: '0'
};