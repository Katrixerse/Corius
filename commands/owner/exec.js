const { exec } = require('child_process');
module.exports.run = (bot, message, args) => {
    if (message.author.id !== "130515926117253122") return message.channel.send("Only bot owner can use this command.");
    const code = args.join(' ');
    if (!code) return message.channel.send('You provided no input silly dev.');
    exec(code, (error, stdout, stderr) => {
        const input = `\`\`\`Bash\n${code}\n\`\`\``;
        if (error) {
            let output = `\`\`\`Bash\n${error}\n\`\`\``;
            message.channel.send(input, {
                split: true
            });
            return message.channel.send(output, {
                split: true
            });
        } else {
            const output = stderr || stdout;
            const output2 = `\`\`\`Bash\n${output}\n\`\`\``;
            message.channel.send(output2, {
                split: true
            });
        }
    });
};

module.exports.config = {
    name: "exec",
    aliases: ["exec"],
    usage: "Don't use this unless you know what you're doing.",
    commandCategory: "owner",
    cooldownTime: '0'
};