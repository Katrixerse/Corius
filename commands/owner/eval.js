const { RichEmbed } = require("discord.js");
const util = require('util');

module.exports.run = (bot, message, args, funcs) => {
    if (message.author.id !== "130515926117253122" && message.author.id !== "307472480627326987") return message.channel.send("Only the bot developers can use this command.");
    var code = args.join(" ");
    if (!code) return message.channel.send(`I can't eval nothing silly dev.`);
    if (code.toLowerCase() === "bot.token" || code.toLowerCase() === "process") return message.channel.send("Dont wanna do that 0_0");
    if (code.toLowerCase().includes("process.exit")) return message.channel.send("Use command reboot instead");
    try {
      var evaled = eval(code);
  
      if (typeof evaled !== "string")
        evaled = util.inspect(evaled);
        const checkCharLength = clean(evaled);
      if (code === clean(evaled)) return message.channel.send('The input was the same as the output.');
      const MAX_CHARS = 3 + 2 + checkCharLength.length + 3;
      if (MAX_CHARS > 1023) {
        message.channel.send("Output exceeded 1024 characters. Sending as a file.", { files: [{ attachment: Buffer.from(checkCharLength), name: "output.txt" }] });
      }
      const embed = new RichEmbed()
        .setColor(funcs.rc())
        .addField(":inbox_tray: Input: ", `\`\`\`${code}\`\`\``)
        .addField(":outbox_tray: Output: ", `\`\`\`js\n${clean(evaled)}\n\`\`\``);
      message.channel.send(embed);
    } catch (err) {
        if (err.message.length > 1023) {
            message.channel.send("Output exceeded 1024 characters. Sending as a file.", { files: [{ attachment: Buffer.from(err.message), name: "output.txt" }] });
        }
      const embed = new RichEmbed()
        .setColor(funcs.rc())
        .addField(":inbox_tray: Input: ", `\`\`\`${code}\`\`\``)
        .addField(":outbox_tray: Output: ", `\`\`\`${clean(err.message)}\`\`\``);
      message.channel.send(embed);
    }
  
    function clean(text) {
      if (typeof (text) === 'string')
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      else
        return text;
    }
  };  

module.exports.config = {
  name: "eval",
  aliases: ["eval"],
  usage: "Don't use this unless you know what you're doing.",
  commandCategory: "owner",
  cooldownTime: '0'
};
