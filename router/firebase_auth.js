// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword , signOut} from "firebase/auth";
import firebaseConfig from "../config/firebase.json"

var router_firebase_user = require('./firebase_user.js');


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const connection  = require('../config/mysql.js');


var express = require('express');
var router = express.Router();

router.use('/',router_firebase_user);


router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    res.send('firebase_auth');
  });

router.post('/signup', function(req, res){
    var request = req.body;
    var email = request.email;
    var password = request.password;
    var student_id = connection.escape(request.student_id);
    var school = connection.escape(request.school);
    var grade = request.grade;
    var class_ = request.class;
    var nickname = request.nickname;
    var profile = request.profile;
    let idClass;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (connection.query(`select *\n from Class \n where School = ${school} and grade = ${grade} and class = ${class_} LIMIT 1`, 
        function (error, results, fields) {
          if (error) throw error;

          if ( results[0] == null){
            idClass = Math.abs(parseInt(hashCode(school)/(10*grade))+class_);
            connection.query(`INSERT INTO Class \n VALUES ( ${idClass}, '${school}', ${grade},${class_} );`,
            (error, rows) => {
            if (error){
                throw error;
            };
            } );
          } else{
            idClass = results[0].idClass;
          }
          

          console.log('The solution is: ', results);
          }
         )
        );
        connection.query(`INSERT INTO User \n VALUES ( "${user.uid}", ${nickname}, ${profile}, ${student_id}, ${idClass});`,
        (error, rows) => {
        if (error) throw error;
        var obj_row = rows[0];
        res.send(Object.values(obj_row));
        } )
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode)
        // ..
      });
      res.send(200); 
    });

router.post('/signin', function(req, res){
  var request = req.body;

  var email = request.id;
  var password = request.password;

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log(user);
    res.send(200);

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
    res.send(400);
  });
}
)

router.post('/signout', function(req, res){
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
})

function hashCode(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
};

export {auth};
module.exports = router;
  
