const { readdirSync } = require("fs");
const funcs = require("./../exports/funcs.js");
const getParent = new funcs().getParent;

module.exports = bot => {
  const load = dirs => {
    const commands = readdirSync(`./commands/${dirs}`).filter(d =>
      d.endsWith(".js")
    );
    for (let file of commands) {
      const pull = require(`../../commands/${dirs}/${file}`);
      try {
        bot.commands.set(pull.config.name, pull);
        bot.usage.set(pull.config.name, pull.config.usage);
        bot.cooldownTime.set(pull.config.name, pull.config.cooldownTime);
        pull.config.aliases.forEach(alias => {
          bot.aliases.set(alias, pull.config.name);
        });
      } catch (err) {
        console.log(`Failed to load command: ${file} Error: ${err.message}`);
      }
      //pull.config.category = getParent(pull.config.name);
    }
  };
  ["canvas", "leveling", "economy", "fun", "info", "miscellaneous", "moderation", "music", "nsfw", "owner", "reddit", "roleplay", "search"].forEach(x => load(x));
};
