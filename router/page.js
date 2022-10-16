var express = require('express');
var router = express.Router();
const connection   = require('../config/mysql.js');
const cookieParser = require('cookie-parser');

router.use(express.json());
router.use(cookieParser());

router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res){
    res.send('page');
});

router.patch('/class',function(req, res){
    var request = req.body;
    var school = request.school_id;
    var grade = request.grade;
    var class_ = request.class;
    let idClass;
    //class id

    const sql = 'select WorkPage.idWorkPage, WorkPage.WorkPageName, WorkPage.date from Class right join WorkPage on Class.idClass = Workpage.ClassId WHERE Class.idSchool = ? AND Class.grade = ? AND Class.class = ?;'
    const para = [school, grade, class_]
    connection.query(sql, para,
    (error, rows) =>{
        if (error){
            res.status(400).send(error.message);
        };
        res.status(200).send(rows)

    }
    )



}
);

router.post('/class',function(req, res){
    var request = req.body;
    var school = request.school_id;
    var grade = request.grade;
    var class_ = request.class;
    const sql = 'INSERT INTO Class(idSchool, grade, class) \n VALUES ( ?, ?, ?);'
    const para = [school, grade, class_]
    connection.query(sql,para,
    (error, rows) => {
    if (error){
        res.status(400).send(error.message);
    };
        res.sendStatus(200);
    } );
}
);

router.patch('/workPage', function(req, res){
    var request = req.body;
    var idWork_page = request.idWork_page;
    const sql = 'SELECT * FROM Posting WHERE idWorkPage = ?'
    connection.query(sql, [idWork_page], 
    (error, rows)=>{
        if (error){
            res.send(error.code);
        }
        res.status(200).send(rows);
    })
})

router.post('/workPage', function(req, res){
    var request = req.body;
    var title = request.title;
    var idClass = request.idClass; //한번에 하나씩만 등록 가능
    var idUser = req.cookies.idUser;
    var content = request.content;
    var date = formatDate(new Date());
    const sql = 'INSERT INTO WorkPage(ClassId, UserIdId, date, WorkPageName, content)  VALUES (?,?,?,?,? )' 
    console.log(para);
    const para = [idClass, idUser, date, title, content];
    connection.query(sql,para,
    (error, rows)=>{
        if (error){
            res.send(error.message);
        }
        res.sendStatus(200);
    })
    

})

router.put('/workPage', function(req, res){
    var request =req.body;
    var idWorkPage = request.idWorkPage;
    var WorkPageName = request.WorkPageName;
    var content = request.content;
    var date = formatDate(new Date());
    var idClass = request.idClass;
    const sql = 'UPDATE WorkPage SET WorkPageName = ?, date = ? , ClassId = ? , content = ? WHERE idWorkPage = ?';
    const para = [WorkPageName, date, idClass, content , idWorkPage];
    connection.query(sql, para, (error, rows)=>{
        if(error){
            res.status(400).send(error.message)
        }
        res.sendStatus(200);
    })
})

router.post('/posting', function(req, res){
    var request = req.body;
    var title = request.title;
    var content = request.content;
    var date = formatDate(new Date());
    var idWork_page = request.idWork_page;
    var idUser = req.cookies.idUser;
    var idStudent = request.idStudent;
    var idFile = request.idFile; //리스트로 값 받음 !!sql injection 주의

    const sql = 'INSERT INTO Posting(title, content, date, idWorkPage, UserId, idStudent) \n VALUES (?,?,?,?,?,?)'
    const para = [title, content, date, idWork_page, idUser, idStudent]
    connection.query(sql,para,
    (error, rows)=>{
        if (error){
            res.status(400).send(error.code);
        }
        if(idFile.length > 0){
            var sql1 = `UPDATE File SET idPosting = ${connection.escape(rows.insertId)} WHERE idFile = ${connection.escape(idFile[0])} `
            for (var i = 1; i < idFile.length; i++){
                sql1 = sql1 + `OR idFile = ${connection.escape(idFile[i])} `
            }
            connection.query(sql1, (error, rows)=>{
                if(error){
                    res.status(500).send(error.message);
                }
                res.sendStatus(200);
            })
        }
        else{
            res.sendStatus(200);
        }


        
    })

})

router.put('/posting', function(req, res){
    var request = req.body;
    var idPosting = request.idPosting;
    var idStudent = request.idStudent;
    var title = request.title;
    var content = request.content;
    var date = formatDate(new Date());
    const sql = 'UPDATE Posting SET idStudent = ?, title = ?, content = ?, date = ? WHERE idPosting = ? ;';
    const para = [idStudent, title, content, date, idPosting]
    connection.query(sql, para, (error, rows)=>{
        if(error){
            res.status(400).send(error.message);
        }
        res.sendStatus(200);

    })
    
})

router.patch('/comment', function(req, res){
    var idPosting = req.query.idPosting;
    const sql = 'SELECT * FROM Comment WHERE PostingId = ?'
    connection.query(sql, [idPosting], (error, rows)=>{
        if(error){
            res.status(400).send(error.message);
        }
        res.status(200).send(rows);
    })    
})

router.post('/comment', function(req, res){
    var request = req.body;
    var idUser = req.cookies.idUser;
    var idPosting = request.idPosting;
    var content = request.content;
    const sql = 'INSERT INTO Comment(idUser, content, PostingId) VALUES ( ?, ?, ?) '
    const para = [idUser, content, idPosting]
    connection.query(sql, para, (error, rows)=>{
        if(error){
            res.status(400).send(error.message);
        }
        res.sendStatus(200);
    })
})

router.put('/comment', function(req, res){
    var request = req.body;
    var idComment = request.idComment;
    var content = request.content;
    const sql = 'UPDATE Comment SET content = ? WHERE idComment = ? '
    const para = [content, idComment]
    connection.query(sql, para, (error,rows)=>{
        if(error){
            res.status(400).send(error.message);
        }
        res.sendStatus(200);
    })
})


function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
function formatDate(date) {
return (
    [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds()),
    ].join(':')
);
}
  

module.exports = router;
