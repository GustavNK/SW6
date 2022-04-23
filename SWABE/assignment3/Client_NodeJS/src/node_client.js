const amqp = require('amqplib/callback_api');
//  Connect to RabbitMQ server
amqp.connect('amqp://admin:password@localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'Reservations';

        var reservationJSON =
        {   "hotelId": 1,
            "checkIn": new Date(), // ISO 8601 date
            "checkOut": new Date().setDate(new Date().getDate() + 1), // ISO 8601 date
            "roomNo": 1,
            "customerName": "Bob Bobsen",
            "customerEmail": "Bobsen@gmail.com",
            "CustomerAddress": "Bobsenvej"
        };

        var jsonString = JSON.stringify(reservationJSON);

        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(jsonString));
        console.log(" [x] Sent %s", jsonString);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
