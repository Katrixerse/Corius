const { richEmbed } = require('discord.js');
const request = require("node-superfetch");

module.exports.run = async (bot, message, args, funcs) => {
    if (!message.channel.nsfw) return funcs.send(`Cannot send NSFW content in a SFW channel.`);
    try {
        let query = args.join(` `);
        if (!query) return funcs.send(`Please enter something to search for.`);
        const { body } = await request
            .get('https://www.googleapis.com/books/v1/volumes')
            .query({
                maxResults: 1,
                q: query,
                key: "Google api key"
            });
        if (!body) return funcs.send(`Couldn't find that book.`);
        if (!body.items) return funcs.send(`Couldn't find that book.`);
        let book = body.items[0].volumeInfo;
        const description = book.description;
        if (!description) return funcs.send(`Couldn't find that book.`);
        const descriptionfix = description.substr(0, 600);
        let embed = new richEmbed()
            .setColor(funcs.rc())
            .setTitle(`${book.title}`)
            .addField(`Written by:`, book.authors)
            .addField(`Published by:`, book.publisher)
            .addField(`Page count:`, book.pageCount)
            .addField("Description", book.description ? descriptionfix : 'No description found.')
            .addField("Purchase link:", book.canonicalVolumeLink)
            .setThumbnail(book.imageLinks.thumbnail);
        message.channel.send(embed);
    } catch (err) {
        if (err.status === 404) return msg.say('Could not find any results.');
        console.log(err);
        return funcs.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
};

module.exports.config = {
    name: "booksearch",
    aliases: [],
    usage: "Search for books.",
    commandCategory: "search",
    cooldownTime: '5'
};