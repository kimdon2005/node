var express = require('express');
var router = express.Router();
var router_auth = require('./auth/auth.js');
var router_class = require('./page');
var router_user = require('./user/user.js');
var router_file = require('./file');
var router_score = require('./score/score')
router.use('/source',router_file);
router.use('/auth',router_auth);
router.use('/page', router_class);
router.use('/user', router_user);
router.use('/score', router_score)



router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    res.send('api');
  });



module.exports = router;
