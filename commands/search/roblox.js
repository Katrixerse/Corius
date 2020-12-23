const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
module.exports.run = async (bot, message, args, funcs) => {
  if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
    try {
        let saybot = args.join('_');
        const url = `https://api.roblox.com/users/get-by-username?username=${saybot}`;
        request.get(url).then(result => {
          const data = result.body.Id;
          if (saybot.length < 1) return send("Please provide a username to search for.");
          if (result.body.Id === "undefined") return send("Couldn't find a roblox user by the name of " + saybot + ".");
          const url2 = `https://api.roblox.com/ownership/hasasset?userId=${data}&assetId=102611803`;
          request.get(url2).then(a => {
            const Verifiedcheck = a.body;
            const embed = new MessageEmbed()
              .setColor(funcs.rc())
              .setTitle("Username: " + saybot)
              .setDescription("User ID: " + data)
              .addField("Verified", Verifiedcheck)
              .setFooter("Profile Link: " + `https://web.roblox.com/users/${data}/profile`)
              .setThumbnail("https://roblox.com/Thumbs/BCOverlay.ashx?username=" + saybot)
              .setImage("http://www.roblox.com/Thumbs/Avatar.ashx?x=100&y=100&Format=Png&username=" + saybot);
            message.channel.send({
              embed
            }).catch(console.error);
          });
        });
      } catch (err) {
        if (err.status === 404) return msg.say('Could not find any results.');
        console.log(err);
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
  name: "roblox",
  aliases: [],
  usage: "Search for a roblox user.",
  commandCategory: "search",
  cooldownTime: "0"
};
