// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword , signOut} from "firebase/auth";
import firebaseConfig from "../config/firebase.json"
const cookieParser = require('cookie-parser');
import cookieConfig from "../config/cookie";




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const connection  = require('../config/mysql.js');



var express = require('express');
var router = express.Router();

router.use(cookieParser());
router.use(express.json());



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
    var student_id = request.student_id;
    var school = request.school;
    var grade = request.grade;
    var class_ = request.class;
    var nickname = request.nickname;
    var profile = request.profile;
    let idClass;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (connection.query(`select *\n from Class \n where School = '${school}' and grade = '${grade}' and class = '${class_}' LIMIT 1`, 
        async function (error, results, fields) {
          if (error){
            console.log(error);
          }
          if ( results[0] == null){
            idClass = await Math.abs(parseInt(hashCode(school)/(10*grade))+class_);
            connection.query(`INSERT INTO Class \n VALUES ( '${idClass}', '${school}', '${grade}','${class_}' );`,
            (error, rows) => {
            if (error){
              console.log(error);
            };
            } );
          } else{
            idClass = results[0].idClass;
            console.log(idClass);
          }
          

          console.log('The solution is: ', results);

          connection.query(`INSERT INTO User \n VALUES ( '${user.uid}', '${nickname}', '${profile}', '${student_id}', '${idClass}');`,
          (error, rows) => {
          if (error) {
            console.log(error);
          }
          } )
          res.cookie('idUser', user.uid, cookieConfig);
          res.cookie('idClass', idClass, cookieConfig);
          res.status(200).send(200);

          }
         )
        );

        // store cookie
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode);
        res.status(400).send(errorCode);
        // ..
      });
    });

router.post('/signin', function(req, res){
  var request = req.body;
  var email = request.id;
  var password = request.password;
  let idClass;
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;

    connection.query(`SELECT idClass FROM User \n WHERE idUser = '${user.uid}'`, 
    (error, rows)=>{
      if (error){
        res.status(400).send(error.message);
    };
      console.log(rows);

      idClass = rows[0].idClass;
      res.cookie('idUser', user.uid, cookieConfig);
      res.cookie('idClass', idClass, cookieConfig);// store cookie
      res.send(200);
    })



    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode)
    console.log(errorMessage);
    res.send(400);
  });
}
)

router.post('/signout', function(req, res){
  signOut(auth).then(() => {
    res.sendStatus(200);
    // Sign-out successful.
  }).catch((error) => {
    res.sendStatus(400);    // An error happened.
  });
})



function hashCode(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
};

export {auth};
module.exports = router;
  
