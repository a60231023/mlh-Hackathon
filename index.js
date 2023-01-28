import mongoose from "mongoose";
// import app from './app'
import config from './config/index.js'
import express from 'express';

const app = express();
console.log("hii");

(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("DB CONNECTED");
        app.on('error', (err) => {
            console.log("ERROR: ", err);
            throw err;
        })

        const onListening = () => {
            console.log(`Listening on ${config.PORT}`)
        }
        console.log(onListening);
        console.log(onListening());
        app.listen(config.PORT, onListening)
    } catch (err) {
        console.log("ERROR ", err);
        throw err;
    }
})()