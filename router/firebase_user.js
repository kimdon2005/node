import {auth} from "./firebase_auth.js"
import { onAuthStateChanged } from "firebase/auth";
const connection   = require('../config/mysql.js');


var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    next();
});

router.get('/user',function(req,res){
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          connection.query(`SELECT * FROM User \nWHERE User_id = '${uid}';`,
            (error, rows) => {
            var obj_row = rows[0];

            res.send(200);
            } 
          )

          // ...
        } else {
          // User is signed out
          // ...
        }
      });
})

module.exports = router;

