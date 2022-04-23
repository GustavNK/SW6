const amqp = require('amqplib/callback_api');
//  Connect to RabbitMQ server
amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'Reservation';
        var msg = 'Hello world';

        var reservationJSON =
        {   "hotelId": 1,
            "checkIn": new Date(), // ISO 8601 date
            "checkOut": new Date().setDate(new Date().getDate() + 1), // ISO 8601 date
            "roomNo": 1,
            "customerName": "Bob Bobsen",
            "customerEmail": "Bobsen@gmail.com",
            "CustomerAddress": "Bobsenvej"
        };



        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(reservationJSON));
        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
