import express = require("express");
import {Response} from 'express';
import https = require('https');
import helmet from 'helmet'
import * as fs from 'fs';
//import path from 'path';
import * as path from 'path'
import { authentications } from './routes/authentications-router'
import { reservations } from './routes/reservations-router'
import { rooms } from './routes/rooms-router'
import * as bodyParser from 'body-parser'
import mongoose = require('mongoose');

const app = express();
const port = 3000;
const httpsPort = 3001;
const options = {
    key: fs.readFileSync(path.join(__dirname, '../selfsigned.key')),
    cert: fs.readFileSync(path.join(__dirname, '../selfsigned.crt'))
};

export const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '..', 'auth-rsa256.key'));
export const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '..', 'public', 'auth-rsa256.key.pub'));

app.use(express.static('public'));
app.use(helmet());

app.use(bodyParser.json());

//Use the routes
app.use('/', authentications);
app.use('/reservations',reservations);
app.use('/rooms',rooms);

mongoose.connect('mongodb://localhost:27017/hotel');

/*********************************************************
    ! LÆS STATUS.MD - TODO list og andre mangler/fejl !
*********************************************************/

app.get('',(_, res: Response) =>{
    
    res.status(200).json({
        'message': 'Dette er et hotel ❤️'
    })
})

https.createServer(options,app).listen(httpsPort, () => {
    console.log(`Running hotel management system on ${httpsPort} with HTTPS 🙈🙈 :O`);    
})

app.listen(port,() => {
    console.log(`Running hotel management system on ${port}`);
})


