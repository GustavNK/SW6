import express from 'express'
import https from 'https'
import helmet from 'helmet'
import fs from 'fs';
import path from 'path';
import { authentications } from './routes/authentications-router'
import { reservations } from './routes/reservations-router'
import { rooms } from './routes/rooms-router'

const app = express();
const port = 3000;
const httpsPort = 3001;
const options = {
    key: fs.readFileSync(path.join(__dirname, '../selfsigned.key')),
    cert: fs.readFileSync(path.join(__dirname, '../selfsigned.crt'))
};

app.use(express.static('public'));
app.use(helmet());

//Use the routes
app.use('/users', authentications);
app.use('/reservations',reservations);
app.use('/rooms',rooms);


app.get('',(req,res) =>{
    res.json({
        'message': 'Dette er et hotel ❤️'
    })
})

https.createServer(options,app).listen(httpsPort, () => {
    console.log(`Running hotel management system on ${httpsPort} with HTTPS :O`);    
})

app.listen(port,() => {
console.log(`Running hotel management system on ${port}`);
})


