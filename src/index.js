const Firebase = require("firebase/compat/app");
require('firebase/compat/database');
const {Client, GatewayIntentBits} = require('discord.js');
require('dotenv').config()

const bot = new Client({intents: [GatewayIntentBits.Guilds]})

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID
};
Firebase.initializeApp(firebaseConfig);
const db = Firebase.database();

bot.once('ready',() => {
    bot.user.setActivity('Watching');
    bot.user.setPresence({ activities: [{ name: bot.guilds.cache.size+((bot.guilds.cache.size > 1)?' Servidores':' Servidor'), type: 3}] });
});

bot.on('guildCreate', async guild => {

    const ROLE_ACTIVE = (guild.roles.cache.find(r => r.name === 'Active') === undefined)? await guild.roles.create({name: 'Active', color: 'Green', permissions: []}): guild.roles.cache.find(r => r.name === 'Active');

    const ROLE_PARTIALLY_ACTIVE = (guild.roles.cache.find(r => r.name === 'Partially Active') === undefined)? await guild.roles.create({name: 'Partially Active', color: 'Yellow', permissions: []}): guild.roles.cache.find(r => r.name === 'Partially Active');

    const ROLE_INACTIVE = (guild.roles.cache.find(r => r.name === 'Inactive') === undefined)? await guild.roles.create({name: 'Inactive', color: 'Red', permissions: []}):guild.roles.cache.find(r => r.name === 'Inactive');

    db.ref('/'+guild.id).set({rules: [ROLE_INACTIVE.id, ROLE_PARTIALLY_ACTIVE.id, ROLE_ACTIVE.id]});

});

bot.login(process.env.DISCORD_TOKEN);