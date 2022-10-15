var express = require('express');
var router = express.Router();
const cookieParser = require('cookie-parser');

router.use(express.json());
router.use(cookieParser());

const connection  = require('../../config/mysql.js');

router.post('/signup', function(req, res){
    res.clearCookie("idUser");
    res.clearCookie("idClass");

    var request = req.body;
    var uid = request.uid;
    var idClass = request.idClass;
    var idStudent = request.idStudent;
    var nickname = request.nickname;
    var idImage = request.idImage;
    let idUser;
    const sql = 'INSERT INTO User(idClass, idStudent, nickname, idImage, idFirebase) VALUES ( ? , ? , ? , ? , ? )'
    const para = [idClass, idStudent, nickname, idImage, uid];
    connection.query(sql, para, (error, rows)=>{
        if(error){
            res.status(400).send(error.message);
        }
        idUser = rows.insertId;
        res.cookie('idUser', idUser, {maxAge: 1000*60*60*24*7});
        res.cookie('idClass', idClass, {maxAge: 1000*60*60*24*7});
        res.sendStatus(200);
    })

})

router.post('/signin', function(req, res){
    res.clearCookie("idUser");
    res.clearCookie("idClass");
    var request = req.body;
    var uid = request.uid;
    let idClass;
    let idUser;
    const sql = 'SELECT idClass, idUser FROM User WHERE idFirebase = ? '
    const para = [uid]
    connection.query(sql, para, (error, rows)=>{
        if(error){
            res.status(400).send(error.message);
        }
        idClass = rows[0].idClass
        idUser = rows[0].idUser
        res.cookie('idUser', idUser, {maxAge: 1000*60*60*24*7});
        res.cookie('idClass', idClass, {maxAge: 1000*60*60*24*7});
        res.send(`${rows[0].idClass}`);

    })
})

router.post('/signout', function(req, res){
  res.clearCookie("idUser");
  res.clearCookie("idClass");
  res.sendStatus(200);
})

module.exports = router;