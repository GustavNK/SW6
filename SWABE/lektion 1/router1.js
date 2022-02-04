const router = require("express").Router();

router.get('/', function (req, res) {
    res.statusCode(200).json('Nice. Im router 1');
});

module.exports = router;