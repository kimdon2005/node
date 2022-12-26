var express = require('express');
var router = express.Router();
const connection   = require('../../config/mysql.js');

router.use(express.json());

router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res){
    res.send('test')
});

router.post('/user', function(req, res){
    var request = req.body;
    var name = request.name;
    var idStudent = request.idStudent;

    const sql = 'INSERT INTO Score(name, idStudent) VALUES ( ? , ? )';
    const para = [name, idStudent];

    connection.query(sql, para,(error, rows)=>{
        if(error){
            res.status(400).send(error.message);
        }
        else{
            res.status(200).send(rows);
        }
    })
})

router.delete( '/user' , function(req, res){
    var request = req.body;
    var idStudent = request.idStudent;

    const sql = 'DELETE FROM Score WHERE idStudent = ?'
    const para = [idStudent]
    connection.query(sql, para, (error, rows)=>{
        if(error){
            res.send(error.message)
        }
        else{
            res.send(rows)
        }
    })
})

router.post('/score', function(req, res){
    var request = req.body;
    var dScore = request.score;
    var idStudent = request.idStudent;
    const sql = 'SELECT score FROM Score WHERE idStudent = ?'
    connection.query(sql, [idStudent], (error, rows)=>{
        if(error){
            res.send(error.message);
        }else{
            var score = rows[0].score + dScore
            const sql1 ='UPDATE Score SET score= ? WHERE idStudent = ?'
            const para = [score , idStudent]
            connection.query(sql1, para, (error, rows)=>{
                if(error){
                    res.send(error.message)
                }
                else{
                    res.send(rows);
                }
            })
        }
    })
})

router.get('/score', function(req, res){
    const sql = 'SELECT * FROM Score'
    connection.query(sql, (error, rows)=>{
        if(error){
            res.send(error.message);
        }
        else{
            res.send(rows);
        }
    })
})



module.exports = router;
