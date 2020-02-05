const { RichEmbed } = require("discord.js");

module.exports.run = (bot, message, args, funcs) => {
    const usage = new RichEmbed()
        .setColor(funcs.rc())
        .setTimestamp()
        .setTitle(`Usage`)
        .setDescription(`Example (without -R): pickmember -O\nExample (with -R): pickmember -O -R Members (-R is at the end)`)
        .addField(`-N`, `Name: none\nDescription: Use this flag if you wish to pick a random member without any conditions.`)
        .addField(`-O`, `Name: online\nDescription: Use this flag if you wish to pick a random member that is online.`)
        .addField(`-R <rolename>`, `Name: hasRole\nDescription: Use this flag along with a role if you wish to pick a random member that has that role.\n:warning: Warning: Flag must be used at the end of the declaration!`);
    if (!args.join(` `)) {
        message.channel.send(usage);
        return funcs.send(`You need to specify a flag!`)
    }
    const flags = args.join(` `) == "-N" ? "none" : args.join(` `);
    if (flags == "none") {
        const em = new RichEmbed()
            .setDescription(`**Member picked:** ${message.guild.members.random()}`)
            .setColor(funcs.rc())
        message.channel.send(em);
    } else if (flags == "-O") {
        const om = message.guild.members.filter(m => m.presence.status == "online");
        if (!om || om.size == 0) return funcs.send(`No members that are online found!`);
        const em = new RichEmbed()
            .setDescription(`**Member picked:** ${om.random()}`)
            .setColor(funcs.rc())
        message.channel.send(em);
    } else if (flags.startsWith(`-O -R `)) {
        const role = flags.substr(6);
        console.log(role);
        const r = message.guild.roles.find(r => r.name == role);
        if (!r) return funcs.send(`No roles with name ${role} found!`);
        const om = message.guild.members.filter(m => m.presence.status == "online").filter(m => m.roles.filter(r => r.name == role).size > 0);
        if (!om || om.size == 0) return funcs.send(`No members that are online with that role found!`);
        const em = new RichEmbed()
            .setDescription(`**Member picked:** ${om.random()}`)
            .setColor(funcs.rc())
        message.channel.send(em);
    } else if (flags.startsWith(`-R `)) {
        const role = flags.substr(3);
        console.log(role);
        const r = message.guild.roles.find(r => r.name == role);
        if (!r) return funcs.send(`No roles with name ${role} found!`);
        const om = message.guild.members.filter(m => m.roles.filter(r => r.name == role).size > 0);
        if (!om || om.size == 0) return funcs.send(`No members with that role found!`);
        const em = new RichEmbed()
            .setDescription(`**Member picked:** ${om.random()}`)
            .setColor(funcs.rc())
        message.channel.send(em);
    } else {
        funcs.send(`Not a valid flag combination!`);
    }
};

module.exports.config = {
    name: "pickmember",
    aliases: ["pm"],
    usage: "Chooses a random member, with an optional condition.",
    commandCategory: "fun",
    cooldownTime: '5'
};
