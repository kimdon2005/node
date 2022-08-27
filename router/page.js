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

router.get('/class',function(req, res){
    var request = req.body;
    var school = request.school;
    var grade = request.grade;
    var class_ = request.class;
    let idClass;
    //class id
    connection.query(`select idClass from Class \n WHERE School = '${school}' AND grade = '${grade}' AND class = '${class_}';`,
    (error, rows) =>{
        if (error){
            res.status(400).send(error);
        };
        if (rows[0] == null){
            res.status(400).send(false);
        }
        idClass = rows[0].idClass;
        
        // get work_pages
        connection.query(`select * from Work_page WHERE idClass = '${idClass}' Order by dateWork_page DESC limit 10;`,
        (error, rows)=>{
            if (error){
                res.status(400).send(error);
            };
            res.status(200).send(rows);
        }
        );
    }
    )



}
);

router.post('/class',function(req, res){
    var request = req.body;
    var school = request.school;
    var grade = request.grade;
    var class_ = request.class;
    connection.query(`INSERT INTO Class \n VALUES ( ${Math.abs(parseInt(hashCode(school)/(10*grade))+class_)}, '${school}', ${grade},${class_} );`,
    (error, rows) => {
    if (error){
        res.status(400).send(error.code);
    };
        res.sendStatus(200);
    } );
}
);

router.get('/workPage', function(req, res){
    var request = req.body;
    var idWork_page = request.idWork_page;
    connection.query(`SELECT * FROM Posting WHERE idWork_page = '${idWork_page}'`, 
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
    var idClass = request.idClass;
    var idUser = req.cookies.idUser;
    var date = formatDate(new Date());
    for( var i = 0; i < idClass.length ; i++){
        connection.query(`INSERT INTO Work_page(idClass, idUser, dateWork_page, title) \n VALUES ('${idClass[i]}', '${idUser}', '${date}', '${title}')`,
        (error, rows)=>{
            if (error){
                res.send(error.code);
            }
            res.status(200).send(200);
        })
    }

})

router.post('/posting', function(req, res){
    var request = req.body;
    var title = request.title;
    var content = request.content;
    var file = request.fileUrl;
    var date = formatDate(new Date());
    var idWork_page = request.idWork_page;
    var idUser = req.cookies.idUser;
    var idStudent = request.idStudent;
    connection.query(`INSERT INTO Posting(title, content, file_url, idWork_page, datePosting, idUser, idStudent) \n VALUES ('${title}', '${content}', '${file}', '${idWork_page}', '${date}', '${idUser}', '${idStudent}')`,
    (error, rows)=>{
        if (error){
            res.send(error.code);
        }
        res.send(rows);
        
    })

})



function hashCode(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
};

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
