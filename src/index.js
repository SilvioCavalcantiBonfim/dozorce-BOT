require('dotenv').config()
const {Client, GatewayIntentBits} = require('discord.js');

const bot = new Client({intents: [GatewayIntentBits.Guilds]})

bot.once('ready', c => {
    bot.user.setStatus('available')
})

bot.login(process.env.DISCORD_TOKEN_BOT);