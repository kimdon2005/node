var express = require('express');
var router = express.Router();
const connection   = require('../config/mysql.js');

router.use(express.json());

router.use(function(req, res, next) {
    next();
});

router.get('/class',function(req, res){
    var request = req.body;
    var school = request.school;
    var grade = request.grade;
    var class_ = request.class;
    connection.query()

    res.send(school);
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
        res.send(error);
        throw error;
    };
    var obj_row = rows[0];

    res.send(Object.values(obj_row));
    } );
}
);


 function hashCode(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
  };

module.exports = router;
