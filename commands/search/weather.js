const { RichEmbed } = require('discord.js');
const request = require("node-superfetch");
const { OPENWEATHERMAP_KEY } = require('../../assets/config.json');
module.exports.run = async (bot, message, args, funcs) => {
    const location = args.join(' ');
    location.replace(/ /g, ',')
    if (!location) return message.channel.send('Need to provide a city.')
    try {
        const {
            body
        } = await request
            .get('https://api.openweathermap.org/data/2.5/weather')
            .query({
                q: location,
                units: 'metric',
                appid: OPENWEATHERMAP_KEY
            });
        const embed = new RichEmbed()
            .setColor(0xFF7A09)
            .setAuthor(
                `${body.name}, ${body.sys.country}`,
                'https://i.imgur.com/NjMbE9o.png',
                'https://openweathermap.org/city'
            )
            .setURL(`https://openweathermap.org/city/${body.id}`)
            .setTimestamp()
            .addField('Condition', body.weather.map(data => `${data.main} (${data.description})`).join('\n'))
            .addField('Temperature', `${body.main.temp}°F`, true)
            .addField('Humidity', `${body.main.humidity}%`, true)
            .addField('Wind Speed', `${body.wind.speed} mph`, true);
        return message.channel.send(embed);
    } catch (err) {
        if (err.status === 404) return message.channel.send('Could not find any results.');
        console.log(err);
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
    name: "weather",
    aliases: [],
    usage: "Search weather for your city.",
    commandCategory: "search",
    cooldownTime: '5'
};