const { readdirSync } = require('fs');
module.exports = (bot) => {
    const load = dirs => {
        const events = readdirSync(`./events/${dirs}`).filter(d => d.endsWith('.js'));
        for (let file of events) {
            let eName = file.split('.')[0];
            const evt = require(`../../events/${dirs}/${file}`);
            bot.on(eName, evt.bind(null, bot));
        }
    };
    ['client', 'guild'].forEach(x => load(x));
};