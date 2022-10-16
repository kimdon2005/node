const express = require('express');
const path = require('path'); //get path
const bodyParser = require("body-parser"); //import body-parser
const connection   = require('./config/mysql.js');
require('dotenv').config({ path: path.join(__dirname, './env/server.env') });//dotenv : env 로드 모듈 server.env 환경변수 가져오기
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')


const adminBro = new AdminBro({
  databases: []
})


var router_api = require('./router/api.js');
const router = AdminBroExpress.buildRouter(adminBro)


const logger = require('./log/winston');
const morgan = require('morgan');
const combined = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"' 
// 기존 combined 포멧에서 timestamp만 제거
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : combined; // NOTE: morgan 출력 형태 server.env에서 NODE_ENV 설정 production : 배포 dev : 개발
console.log(morganFormat);

// import express from "express";
const app = express(); // define instance of express



var port = "3001";  // set port number
app.set('port', port); 

app.use(adminBro.options.rootPath, router)
app.use(express.static(path.join(__dirname, "client/build"))); // define to use that path file
app.use('/api',router_api);
app.use(morgan(morganFormat, {stream : logger.stream})); // morgan 로그 설정 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
});

app.get('/test/info', (req, res, next) => {
  logger.info('info test');
  res.status(200).send({
      message : "info test!"
  })
});

app.get('/users', (req, res) => {
  connection.query('SELECT * from people', (error, rows) => {
    if (error) {
      res.send(error);
    }
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

app.post('/users', (req, res) => {
  var person_id = connection.escape(req.query.person_id);
  var person_name = connection.escape(req.query.person_name);
  var age = connection.escape(req.query.age);
  var birthday = connection.escape(req.query.birthday);

  var sql = `INSERT INTO people \n VALUES ( ${person_id}, ${person_name}, ${age}, ${birthday});`
  connection.query(sql, (error, rows) => {
    if (error) {
      res.send(error);
    }
    console.log('User info is: ', rows);
    res.send(rows);
  });
});


  
var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('Server is working : PORT - ',port);
});

module.exports = app;
