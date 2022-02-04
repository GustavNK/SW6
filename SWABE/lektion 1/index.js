const express = require('express');

const PORT = 8000;

function main(){

    const app = express();
    app.use('/r1', require("./router1"));
    console.log('Hello server. Almost live!');
    app.listen(PORT, () => {
        console.log(`Express runnning at ${PORT}`);
    });
}
main();