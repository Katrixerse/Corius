const {
    richEmbed
} = require('discord.js');
const {
    registerFont
} = require('canvas');
const {
    Canvas
} = require('canvas-constructor');
registerFont('./assets/fonts/Segoe-UI.ttf', {
    family: 'Segoe'
});
const fsn = require('fs-nextra');
const request = require('node-superfetch');

module.exports.run = (bot, message, args, funcs, con) => {
    try {
        con.query(`SELECT * FROM guildSettings WHERE guildId ="${message.guild.id}"`, async (e, row) => {
            row = row[0];
            if (row.economyEnabled == "false") return;
            if (row.levelingEnabled == "false") return;
            let whoto = message.mentions.members.first() || message.member;
            con.query(`SELECT * FROM guildCash WHERE guildId ="${message.guild.id}" AND userId ="${whoto.id}"`, async (e, row1) => {
                con.query(`SELECT * FROM guildLeveling WHERE guildId ="${message.guild.id}" AND userId ="${whoto.id}"`, async (e, row2) => {
                    con.query(`SELECT * FROM guildRep WHERE guildId ="${message.guild.id}" AND userId ="${whoto.id}"`, async (e, row3) => {
                        const prestige = row2.length == 0 ? 0 : row2[0].userPrestige;
                        const level = row2.length == 0 ? 0 : row2[0].userLevel;
                        const xp = row2.length == 0 ? 0 : `${row2[0].userXP}/${row2[0].userLevel * 400}`;
                        const cash = row1.length == 0 ? '$0' : `${row1[0].userCash}`;
                        const bank = row1.length == 0 ? '$0' : `$${row1[0].userBankedCash}`;
                        const networth = row1.length == 0 ? '$0' : `$${row1[0].userBankedCash + row1[0].userCash}`;
                        const rep = row3.length == 0 ? 0 : row3[0].rep;
                        if (row.levelingDisplayMode == "text") {
                            const embed = new richEmbed()
                                .setColor(funcs.rc())
                                .setTitle(`${whoto.user.tag}'s Profile`)
                                .addField(`Prestige:`, prestige, true)
                                .addField(`Level:`, level, true)
                                .addField(`XP:`, xp, true)
                                .addField(`Cash:`, cash, true)
                                .addField(`Bank:`, bank, true)
                                .addField(`Networth:`, networth)
                                .addField(`REP:`, rep);
                            message.channel.send(embed);
                        } else {
                            if (!row1) return funcs.send(`It seems like that user isn't ranked yet.`);
                            if (!row2) return funcs.send(`It seems like that user isn't ranked yet.`);
                            const usersusernamefix = whoto.user.username.substr(0, 23);
                            const getSlapped = async (person) => {
                                const plate = await fsn.readFile('./assets/images/coriusprofile.png');
                                const png = person.replace('.gif', '.png');
                                const {
                                    body
                                } = await request.get(png);
                                return new Canvas(1280, 720)
                                    .addImage(plate, 0, 0, 1280, 720)
                                    .setTextFont('64px Segoe')
                                    .addText(usersusernamefix, 570, 124)
                                    .setTextFont('36px Segoe')
                                    .addText(xp, 618, 228)
                                    .setTextFont('36px Segoe')
                                    .addText(prestige, 715, 294)
                                    .setTextFont('36px Segoe')
                                    .addText(networth, 766, 416)
                                    .setTextFont('36px Segoe')
                                    .addText(rep, 636, 482)
                                    .setTextFont('36px Segoe')
                                    .setTextAlign("center")
                                    .addText(level, 670, 358)
                                    .addImage(body, 117, 163, 396, 396, { type: 'round', radius: 198 })
                                    .toBuffer();
                            };
                            try {
                                const person = whoto.user.avatarURL;
                                const result = await getSlapped(person);
                                await message.channel.send({
                                    files: [{
                                        attachment: result,
                                        name: 'userprofile.png'
                                    }]
                                });
                            } catch (error) {
                                throw error;
                            }
                        }
                    })
                });
            });
        });
    } catch (e) {
        console.log(e);
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
}


module.exports.config = {
    name: "profile",
    aliases: ["profile"],
    usage: "Check your user profile (or somebody else's)",
    commandCategory: "leveling",
    cooldownTime: "5"
};