const {
    shuffle,
    verify
} = require('./../../handlers/miscfuncs.js');
const suits = ['♣', '♥', '♦', '♠'];
const faces = ['Jack', 'Queen', 'King'];
const games = new Map();
const deckCount = 3;

module.exports.run = async (bot, message, args, funcs, con) => {
    con.query(`SELECT gs.economyEnabled AS economy FROM guildSettings AS gs WHERE gs.guildId ="${message.guild.id}"`, (e, settings) => {
        if (settings[0].economy == "false") return;
    });
        con.query(`SELECT * FROM guildCash WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`, async (e, row2) => {
        if (!row2 || row2.length == 0 || row2[0].userCash == 0) return funcs.send(`You haven't earned any cash yet.`);
        try {
            const userBet = parseInt(args.join(` `));
            let won = Math.round(userBet * 2);
            if (!userBet) return funcs.send(`Please provide a number to gamble!`);
            if (isNaN(userBet) || userBet <= 0) return funcs.send(`Not a valid number.`);
            if (!isFinite(userBet)) return funcs.send(`Not a valid number.`);
            if (userBet >= 100000) return funcs.send(`Number cannot be higher than 100,000.`);
            if (userBet > row2[0].userCash) return funcs.send(`Cannot bet a number higher than your balance.`);
            const current = games.get(message.channel.id);
            if (current) return message.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
            games.set(message.channel.id, {
                name: 'Blackjack',
                data: generateDeck(deckCount)
            });
            const dealerHand = [];
            draw(message.channel, dealerHand);
            draw(message.channel, dealerHand);
            const playerHand = [];
            draw(message.channel, playerHand);
            draw(message.channel, playerHand);
            const dealerInitialTotal = calculate(dealerHand);
            const playerInitialTotal = calculate(playerHand);
            if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
                games.delete(message.channel.id);
                return funcs.send('Well, both of you just hit blackjack. Right away. Rigged.');
            } else if (dealerInitialTotal === 21) {
                games.delete(message.channel.id);
                funcs.send('Ouch, the dealer hit blackjack right away! Try again!');
                return con.query(`UPDATE guildCash SET userCash = ${row2[0].userCash - userBet} WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`);
            } else if (playerInitialTotal === 21) {
                games.delete(message.channel.id);
                funcs.send('Wow, you hit blackjack right away! Lucky you!');
                return con.query(`UPDATE guildCash SET userCash = ${row2[0].userCash + won} WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`);
            }
            let playerTurn = true;
            let win = false;
            let reason;
            while (!win) {
                if (playerTurn) {
                    await message.channel.send(`**First Dealer Card:** ${dealerHand[0].display}\n**You (${calculate(playerHand)}):**\n${playerHand.map(card => card.display).join('\n')}\n_Hit (type yes or no)?_
                `);
                    const hit = await verify(message.channel, message.author);
                    if (hit) {
                        const card = draw(message.channel, playerHand);
                        const total = calculate(playerHand);
                        if (total > 21) {
                            reason = `You drew ${card.display}, total of ${total}! Bust`;
                            break;
                        } else if (total === 21) {
                            reason = `You drew ${card.display} and hit 21`;
                            win = true;
                        }
                    } else {
                        const dealerTotal = calculate(dealerHand);
                        await funcs.send(`Second dealer card is ${dealerHand[1].display}, total of ${dealerTotal}.`);
                        playerTurn = false;
                    }
                } else {
                    const inital = calculate(dealerHand);
                    let card;
                    if (inital < 17) card = draw(message.channel, dealerHand);
                    const total = calculate(dealerHand);
                    if (total > 21) {
                        reason = `Dealer drew ${card.display}, total of ${total}! Dealer bust`;
                        win = true;
                    } else if (total >= 17) {
                        const playerTotal = calculate(playerHand);
                        if (total === playerTotal) {
                            reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-${total}`;
                            break;
                        } else if (total > playerTotal) {
                            reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-**${total}**`;
                            break;
                        } else {
                            reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}**${playerTotal}**-${total}`;
                            win = true;
                        }
                    } else {
                        await funcs.send(`Dealer drew ${card.display}, total of ${total}.`);
                    }
                }
            }
            games.delete(message.channel.id);
            if (win) { 
            message.channel.send(`${reason}! You won x2 your bet for a total of: $${won}!`);
            return con.query(`UPDATE guildCash SET userCash = ${row2[0].userCash + won} WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`);
        } else {
            message.channel.send(`${reason}! Too bad you lost: $${userBet.toFixed(2)}.`);
            return con.query(`UPDATE guildCash SET userCash = ${row2[0].userCash - userBet} WHERE guildId = "${message.guild.id}" AND userId = "${message.author.id}"`);
        }
        } catch (err) {
            games.delete(message.channel.id);
            throw err;
        }
    });
};

module.exports.config = {
    name: "blackjack",
    aliases: [''],
    usage: "Use this command to see somebody's balance.",
    commandCategory: "economy",
    cooldownTime: '3'
};

function generateDeck(deckCount) {
    const deck = [];
    for (let i = 0; i < deckCount; i++) {
        for (const suit of suits) {
            deck.push({
                value: 11,
                display: `${suit} Ace`
            });
            for (let j = 2; j <= 10; j++) {
                deck.push({
                    value: j,
                    display: `${suit} ${j}`
                });
            }
            for (const face of faces) {
                deck.push({
                    value: 10,
                    display: `${suit} ${face}`
                });
            }
        }
    }
    return shuffle(deck);
}

function draw(channel, hand) {
    const deck = games.get(channel.id).data;
    const card = deck[0];
    deck.shift();
    hand.push(card);
    return card;
}

function calculate(hand) {
    return hand.sort((a, b) => a.value - b.value).reduce((a, b) => {
        let {
            value
        } = b;
        if (value === 11 && a + value > 21) value = 1;
        return a + value;
    }, 0);
}