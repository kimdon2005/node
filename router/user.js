var express = require('express');
var router = express.Router();
const connection   = require('../config/mysql.js');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
var fs = require('fs');

router.use(express.json());
router.use(cookieParser());
router.use(fileUpload());

router.use(function(req, res, next) {
    next();
});

router.get('/',function(req,res){
    var idUser = req.cookies.idUser;
    connection.query(`SELECT * FROM User WHERE idUser = '${idUser}';`,
    (error, rows) => {
      res.send(rows[0]);
    } 
    )
  })

router.put('/', function(req,res){
    var idUser = req.cookies.idUser;

    var request = req.body;
    var nickname = request.nickname;
    var profile = request.profile;
    var idStudent = request.idStudent;
    connection.query(`UPDATE User SET nickname = '${nickname}', profile_image = '${profile}', idStudent = '${idStudent}' WHERE idUser = '${idUser}'`,
    (error, rows)=>{
        if(error){
            res.send(error);
        }
        res.sendStatus(200);
    })
})



module.exports = router;
