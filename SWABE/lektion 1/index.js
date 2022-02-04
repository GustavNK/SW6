const express = require('express');

const PORT = 8000;

function main(){

    const app = express();
    app.use('/ping', require("./router1"));
    console.log('Hello server. Almost live!');
    app.listen(PORT, () => {
        console.log(`Express runnning at port:${PORT}`);
    });
}
main();