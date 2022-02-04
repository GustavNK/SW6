const router = require("express").Router();

router.get('/', function (req, res) {
    res.status(200).json('pong');
});

module.exports = router;