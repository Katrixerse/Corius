module.exports.run = (bot, message, args, funcs, con) => {
    con.query(`SELECT guildMods FROM guildModerators WHERE guildId ="${message.guild.id}"`, (e, rows) => {
        let row1 = rows.map(r => r.guildMods);
        const permissionNeeded = "MANAGE_GUILD";
        if (!message.member.hasPermission(permissionNeeded, false, true, true) && !row1.includes(message.author.id)) return funcs.send(`You do not have the permission ${permissionNeeded} to use this command.`, true);
        const teams = [{
            name: "#blossom",
            color: "#ff6b87"
        }, {
            name: "#fire",
            color: `#ff6d2e`
        }, {
            name: "#ice",
            color: "#2ea1ff"
        }, {
            name: "#wind",
            color: "#ffffe6"
        }, {
            name: "#spring",
            color: "#b0ff9e"
        }, {
            name: "#summer",
            color: "#efc2f1"
        }, {
            name: "#fall",
            color: "#ff8a24"
        }, {
            name: "#winter",
            color: "#b5fffb"
        }, {
            name: "#earth",
            color: "#f0a884"
        }];
        teams.forEach(team => {
            if (message.guild.roles.filter(r => r.name == team.name).size > 0) return;
            message.guild.createRole({
                name: team.name,
                color: team.color
            });
        });
        funcs.send(`Teams have been created.`);
    });
};

module.exports.config = {
    name: "createteams",
    aliases: [],
    usage: "Create the teams for this guild.",
    commandCategory: "fun",
    cooldownTime: "0"
};
