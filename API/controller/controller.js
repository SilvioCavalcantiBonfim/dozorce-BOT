const Firebase = require("firebase/compat/app");
require('firebase/compat/database');
require('dotenv').config()

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

exports.server = (req, res, next) => {
    const SERVER_ID = req.params.server;
    db.ref("/"+SERVER_ID).once('value', v => {
        res.status(200).send((v.val() === null)?{status: 503}:v.val());
    });
}

exports.user = (req, res, next) => {
    const SERVER_ID = req.params.server;
    const USER_ID = req.params.user;
    db.ref("/"+SERVER_ID+"/"+USER_ID).once('value', v => {
        res.status(200).send((v.val() === null)?{status: 503}:v.val());
    });
}

exports.auth = (req, res, next) => {
    res.status(200).send({authentication: true})
}