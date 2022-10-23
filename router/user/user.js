var express = require('express');
var router = express.Router();
const connection   = require('../../config/mysql.js');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const logger = require('../../log/winston.js');

router.use(express.json());
router.use(cookieParser());
router.use(fileUpload());

router.use(function(req, res, next) {
    next();
});

router.get('/',function(req,res){
    var idUser = req.cookies.idUser;
    const sql = 'SELECT * FROM User WHERE idUser = ? ;'
    connection.query(sql, [idUser],
    (error, rows) => {
    if(error){
        res.status(400).send(error.message);
        logger.error('ERROR GET /api/user ' + error.name);
    }
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
    const sql = 'UPDATE User SET nickname = ?, idImage = ?, idStudent = ?  WHERE idUser = ?'
    const para = [nickname, profile, idStudent, idUser]
    connection.query(sql,para ,
    (error, rows)=>{
        if(error){
            res.send(error);
            logger.error('ERROR PUT /api/user ' + error.name);
        }
        res.sendStatus(200);
        logger.info('PUT /api/user ')
    })
})

router.post('/class', function(req, res){
    var idSchool = req.query.idSchool;
    var grade = req.query.grade;
    var class_ = req.query.class;
    const sql = 'SELECT idClass FROM Class WHERE idSchool = ? AND grade = ? AND class = ?'
    const para = [idSchool, grade, class_]
    connection.query(sql, para, (error, rows)=>{
        if(error){
            res.status(400).send(error.message);
            logger.error('ERROR POST /api/user/class ' + error.name);
        }
        res.send(rows[0])
        logger.info('POST /api/user/class ')

    })
})

router.patch('/school', function(req, res){
    var name = req.query.name;
    const sql = "SELECT * FROM School WHERE nameSchool like " + "'%" + name + "%'"
    console.log(sql)
    connection.query(sql, (error, rows)=>{
        if(error){
            res.status(400).send(error.message);
            logger.error('ERROR POST /api/user/school ' + error.name);

        }
        res.send(rows);
        logger.info('PATCH /api/user/school ');

    })
})

router.post('/school', function(req, res){
    var name = req.query.name;
    var region = req.query.region;

    const sql = 'INSERT INTO School(nameSchool, region) VALUES ( ? , ? );'
    connection.query(sql, [name, region], (error, rows)=>{
        if(error){
            res.status(400).send(error.message);
            logger.error('ERROR POST /api/user/school ' + error.name);

        }
        res.sendStatus(200);
        logger.info('POST /api/user/school ');
    })
})


module.exports = router;
