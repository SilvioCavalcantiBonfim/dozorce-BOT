const Firebase = require("firebase/compat/app");
const tool = require('./toolkit');
require('firebase/compat/database');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config()

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] })

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

bot.once('ready', () => {
    bot.user.setActivity('Watching');
    bot.user.setPresence({ activities: [{ name: bot.guilds.cache.size + ((bot.guilds.cache.size > 1) ? ' Servidores' : ' Servidor'), type: 3 }] });
});

bot.on('guildCreate', async guild => {

    bot.user.setActivity('Watching');
    bot.user.setPresence({ activities: [{ name: bot.guilds.cache.size + ((bot.guilds.cache.size > 1) ? ' Servidores' : ' Servidor'), type: 3 }] });

    let data = {};

    await guild.members.fetch().then(members => members.forEach(member => {
        if (!member.user.bot) {
            data[member.user.id] = { name: member.user.username + "#" + member.user.discriminator, avatar: (member.user.avatarURL() === undefined) ? member.user.defaultAvatarURL() : member.user.avatarURL(), active: -1, register: { '0': 0 } };
        }
    }));
    db.ref('/' + guild.id).set(data);
});

bot.on('guildDelete', guild => {
    bot.user.setActivity('Watching');
    bot.user.setPresence({ activities: [{ name: bot.guilds.cache.size + ((bot.guilds.cache.size > 1) ? ' Servidores' : ' Servidor'), type: 3 }] });
});

const default_register = {
    active: -1,
    avatar: '',
    name: '',
    bot: false,
    register: {'0': 0}
}

bot.on('voiceStateUpdate', async (before, after) => {
    var allmember = (await before.guild.members.fetch()).map(m => { return m.user.id });
    let stateChannels = Number(before.channelId !== null) + 2 * Number(after.channelId !== null);
    if (stateChannels === 2 || stateChannels === 1) {
        db.ref('/' + [before, after][stateChannels - 1].guild.id).once('value', s => {
            const DB_SERVER = s.val();
            let NEW_DB_SERVER = DB_SERVER;
            //2 - join
            //1 - separate
            if (Boolean(stateChannels - 1)) {
                after.channel.members.map(m => {
                    if (!DB_SERVER.hasOwnProperty(m.user.id)) {
                        NEW_DB_SERVER[m.user.id] = default_register;
                    }
                    NEW_DB_SERVER[m.user.id].active = Date.now();
                    NEW_DB_SERVER[m.user.id].name = m.user.username + '#' + m.user.discriminator;
                    NEW_DB_SERVER[m.user.id].avatar = (m.user.avatarURL() === null) ? m.user.defaultAvatarURL : m.user.avatarURL();
                    NEW_DB_SERVER[m.user.id].bot = m.user.bot;
                });
                db.ref('/' + after.guild.id).set(NEW_DB_SERVER);
            } else {
                allmember.filter(id => { return before.channel.members.map(m => m.user.id).indexOf(id) === -1 }).map(id => {
                    // console.log("\033[1;37mAccessing:\033[0m " + before.guild.id + "/" + id);
                    db.ref(before.guild.id + "/" + id).once('value', read => {
                        if (read.val() === null) {
                            if (!DB_SERVER.hasOwnProperty(id)) {
                                let CurrentUser = before.guild.members.cache.get(id);
                                NEW_DB_SERVER[id] = default_register;
                                NEW_DB_SERVER[id].name = CurrentUser.user.username + '#' + CurrentUser.user.discriminator;
                                NEW_DB_SERVER[id].avatar = (CurrentUser.user.avatarURL() === null) ? CurrentUser.user.defaultAvatarURL : CurrentUser.user.avatarURL();
                                NEW_DB_SERVER[id].bot = CurrentUser.user.bot;
                            }
                        } else if (DB_SERVER[id].active !== -1) {
                            let date = new Date();
                            let date_refenrence = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                            if (NEW_DB_SERVER[id].register.hasOwnProperty(date_refenrence.getTime().toString()))
                                NEW_DB_SERVER[id].register[date_refenrence.getTime().toString()] = DB_SERVER[id].register[date_refenrence.getTime().toString()] + (Date.now() - DB_SERVER[id].active);
                            else
                                NEW_DB_SERVER[id].register[date_refenrence.getTime().toString()] = (Date.now() - DB_SERVER[id].active);
                            NEW_DB_SERVER[id].active = -1;
                        }
                        console.dir(NEW_DB_SERVER[id]);
                        db.ref('/' + after.guild.id+"/"+id).set(NEW_DB_SERVER[id]);
                    });
                });
            }
        });
    }
});

bot.login(process.env.DISCORD_TOKEN);