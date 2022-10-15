var express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

var router = express.Router();
const connection   = require('../config/mysql.js');

router.use(fileUpload());
router.use(express.json());

router.use(function(req, res, next) {
    next();
});


router.post('/image',function(req,res){
    let __dirname = '/Users/gimdong-yun/server'
    // let __dirname = '/root/server/content'
    let uploadFile = req.files.file
    const fileName = req.files.file.name
    uploadFile.mv(
      `${__dirname}/src/images/${fileName}`,
      function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        var filepath = `src/images/${fileName}`;
        const sql = 'INSERT INTO Image(filePath) VALUES( ? )'
        connection.query(sql, [filepath],
        (error, rows)=>{
            if (error) {
                return res.status(500).send(err);
              }
            res.send(`${rows.insertId}`); // 파일 업로드 시 클라로 파일의 아이디 리턴
        })
      }
    );

})

router.post('/files',function(req,res){
    let __dirname = '/Users/gimdong-yun/server'
    // let __dirname = '/root/server/content'
    let uploadFile = req.files.file
    const fileName = req.files.file.name
    uploadFile.mv(
      `${__dirname}/src/files/${fileName}`,
      function (err) {
        if (err) {
          return res.status(500).send(err.message);
        }
        var filepath = `src/files/${fileName}`;
        connection.query('INSERT INTO File(filePath) VALUES (?)',[filepath],
        (error, rows)=>{
            if (error) {
                return res.status(500).send(error.message);
              }
            res.send(`${rows.insertId}`);
        })
      }
    );

})

module.exports = router;
