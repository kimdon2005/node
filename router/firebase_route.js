// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from "../firebase.json"


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


var express = require('express');
var router = express.Router();



router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    res.send('hi1');
  });

router.post('/signup', function(req, res){
    var email = req.query.id;
    var password = req.query.password;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode)
        // ..
      });
    res.send('neejfmfjomdj')
});

router.post( '/signin', function(req, res){
  var email = req.query.id;
  var password = connection.escape(req.query.password);
  
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log(user);
    res.send('veryfied');

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}
)

module.exports = router;

  
