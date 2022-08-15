var express = require('express');
var router = express.Router();
var router_firebase = require('./firebase_auth.js');
var router_class = require('./page');

router.use('/firebase',router_firebase);
router.use('/page', router_class)


router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    res.send('api');
  });



module.exports = router;
