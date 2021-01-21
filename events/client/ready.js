const create = require('../../handlers/createDb');
const activities = require('../../utils/activity.json');
const request = require('node-superfetch');
const { dblKey, botsggkey } = require('../../assets/config.json');
const ms = require('ms');
module.exports = async (bot) => {
  await create.createDb();
  bot.user.setPresence({
    game: {
      name: `in ${bot.guilds.size} servers. | c!help`,
      type: 'PLAYING'
    }
  });
  const activity = activities[Math.floor(Math.random() * activities.length)];
  bot.setInterval(() => {
    bot.user.setPresence({
      game: {
        name: activity.text,
        type: activity.type
      }
    });
    //top.gg
    request.post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
      .set('Authorization', dblKey)
      .send({
        server_count: bot.guilds.size,
      })
      .then(() => console.log(`Posted to dbl.`))
      .catch((e) => console.error(e.message));
      // bots .gg
      request.post(`https://discord.bots.gg/api/v1/bots/${bot.user.id}/stats`)
      .set('Authorization', botsggkey)
      .send({
        guildCount: bot.guilds.size,
      })
      .then(() => console.log(`Posted to dbl.`))
      .catch((e) => console.error(e.message));
  }, ms("130m")); // setting it up so it auto updates every hour and 30 mins
  // this code below is used it set it at start up
  request.post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
    .set('Authorization', dblKey)
    .send({
      server_count: bot.guilds.size,
    })
    .then(() => console.log(`Posted to top.gg.`))
    .catch((e) => console.error(e.message));
    request.post(`https://discord.bots.gg/api/v1/bots/${bot.user.id}/stats`)
    .set('Authorization', botsggkey)
    .send({
      guildCount: bot.guilds.size,
    })
    .then(() => console.log(`Posted to dbl.gg.`))
    .catch((e) => console.error(e.message));
  const { addDbEntry } = require('../../handlers/addDbEntry');
  bot.guilds.forEach(async guild => {
    const guildId = guild.id;
    await addDbEntry(guildId);
    console.log('Added guild with ID: ' + guildId)
  });
  console.log(`${bot.user.username} loaded. Currently in ${bot.guilds.size} server(s) with ${bot.users.size} users.`);
};