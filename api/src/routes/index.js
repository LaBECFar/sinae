const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    return res.status(200).send({
        title: "Sinae API",
        version: "0.0.1"
    });
});

module.exports = router;