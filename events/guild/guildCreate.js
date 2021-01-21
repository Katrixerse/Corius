const create = require('../../handlers/addDbEntry');

module.exports = async (bot, guild) => {
    try {
        const guildId = guild.id;
        await create.addDbEntry(guildId);
        console.log(`The Guild ID: ${guild.id} has been writen to the db.`);
        bot.channels.get(`628619189795422209`).send(`Bot has been invited to a new server!\nName: ${guild.name}\nID: ${guild.id}\nOwner: ${guild.owner.displayName}\nMembercount: ${guild.memberCount}`);
        if (guildId === '264445053596991498') return;
        if (guildId === '110373943822540800') return;
        guild.owner.user.send(`***Hey there! Thanks for inviting Corius to your server. The default prefix is "c!". We also have a website and a help command for documentation! Enjoy Corius. https://corius.site/.***`).catch(() => console.log('Failed to dm guild owner'));
    } catch (err) {
        console.log(err);
    }
};