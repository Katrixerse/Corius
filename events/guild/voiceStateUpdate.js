module.exports = (bot, oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel
    const GuildCheck = bot.channels.get(oldMember.voiceChannelID);
    if (GuildCheck) {
        if (oldUserChannel !== undefined && oldUserChannel !== newUserChannel) {
            if (oldUserChannel.members.size === 1) {
                GuildCheck.leave();
            }
        }
    }
};