var amqp = require('amqplib/callback_api');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// if the connection is closed or fails to be established at all, we will reconnect
var amqpConn = null;
function start() {
    amqp.connect(process.env.RABBITMQ_URL + "?heartbeat=60", function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }
        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });
        console.log("[AMQP] connected");
        amqpConn = conn;
        startWorker();
    });
}
// A worker that acks messages only if processed succesfully
function startWorker() {
    amqpConn.createChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });

        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(10);
        ch.assertQueue("Reservations", { durable: false }, function (err, _ok) {
            if (closeOnErr(err)) return;
            ch.consume("Reservations", processMsg, { noAck: false });
            console.log("Worker is started");
        });
        ch.assertQueue("Confirms", { durable: false }, function (err, _ok) {
            if (closeOnErr(err)) return;
            console.log("Confirms queue exists");
        });

        function processMsg(msg) {
            try {
                console.log('Processed msg');
                // Write to disk
                let msgContent = JSON.parse(msg.content);
                msgContent.confirmationId = uuidv4();
                fs.writeFile('./test.txt', JSON.stringify(msgContent) + '\r\n', { flag: 'a+' }, err => {});
                // Send to confirmation
                ch.sendToQueue("Confirms", Buffer.from(JSON.stringify(msgContent)));
                ch.ack(msg);
            } catch (e) {
                closeOnErr(e);
            }
        }
    });
}

function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
}

start();
