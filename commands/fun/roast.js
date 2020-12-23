const { MessageEmbed } = require('discord.js');
module.exports.run = async (bot, message, args, funcs) => {
    try {
        let whoto = message.mentions.members.first();
        if (!whoto) return funcs.send(`Please mention somebody to roast.`);
        if (whoto.id == message.author.id) return funcs.send(`Can't roast yourself, right?`);
        var roasts = [
            "My phone battery lasts longer than your relationships.",
            "Calm down. Take a deep breath and then hold it for about twenty minutes.",
            "Jealousy is a disease. Get well soon, bitch!",
            "You’re so real. A real ass.",
            "Whoever told you to be yourself gave you really bad advice.",
            "If I had a face like yours I’d sue my parents.",
            "Where’s your off button?",
            "I didn’t change. I grew up. You should try it sometime.",
            "I thought I had the flu, but then I realized your face makes me sick to my stomach.",
            "The people who know me the least have the most to say.",
            "I’m jealous of people who don’t know you.",
            "I’m sorry that my brutal honesty inconvenienced your ego.",
            "You sound reasonable… Time to up my medication.",
            "Aww, it’s so cute when you try to talk about things you don’t understand.",
            "Is there an app I can download to make you disappear?",
            "I’m sorry, you seem to have mistaken me with a woman who will take your shit.",
            "I’m visualizing duck tape over your mouth.",
            "90% of your ‘beauty’ could be removed with a Kleenex.",
            "I suggest you do a little soul searching. You might just find one.",
            "Some people should use a glue stick instead of chapstick.",
            "My hair straightener is hotter than you.",
            "I have heels higher than your standards.",
            "I’d smack you, but that would be animal abuse.",
            "Why is it acceptable for you to be an idiot but not for me to point it out?",
            "If you’re offended by my opinion, you should hear the ones I keep to myself.",
            "If you’re going to be a smart ass, first you have to be smart, otherwise you’re just an ass.",
            "Your face is fine but you will have to put a bag over that personality.",
            "Hey, I found your nose, it’s in my business again!",
            "I’m not an astronomer but I am pretty sure the earth revolves around the sun and not you.",
            "I might be crazy, but crazy is better than stupid.",
            "It’s scary to think people like you are allowed to vote.",
            "Keep rolling your eyes. Maybe you’ll find your brain back there",
            "No, no. I am listening. It just takes me a moment to process so much stupid information all at once.",
            "I’m sorry, what language are you speaking? It sounds like bullshit.",
        ];
        const embed = new MessageEmbed()
            .setTitle("Roasted :scream: :fire:!!")
            .setColor(funcs.rc())
            .setThumbnail("https://thumbs.gfycat.com/DependableBoringHumpbackwhale-size_restricted.gif")
            .setDescription(`${whoto.user.username}, ` + roasts[Math.floor(Math.random() * roasts.length)]);
        message.channel.send(embed);
    } catch (e) {
        console.error;
        funcs.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
};

module.exports.config = {
    name: "roast",
    aliases: [],
    usage: "Use this command to roast somebody.",
    commandCategory: "fun",
    cooldownTime: '5'
};