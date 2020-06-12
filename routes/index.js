const express = require('express');
const router = express.Router();


/*
router.get('/', function(req, res) {
	res.send('Hello, world!');
});
*/

router.use('/', express.static('public'));

module.exports = router;
