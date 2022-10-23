const express = require('express');
const path = require('path'); //get path
const bodyParser = require("body-parser"); //import body-parser
const connection   = require('./config/mysql.js');
require('dotenv').config({ path: path.join(__dirname, './env/server.env') });//dotenv : env 로드 모듈 server.env 환경변수 가져오기
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const cors = require('cors');


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

let corsOptions = {
  origin: "http://localhost:3001", // 출처 허용 옵션
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};


var port = "3001";  // set port number
app.set('port', port); 

app.use(adminBro.options.rootPath, router)
app.use(express.static(path.join(__dirname, "client/build"))); // define to use that path file
app.use('/api',router_api);
app.use(morgan(morganFormat, {stream : logger.stream})); // morgan 로그 설정 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors(corsOptions)); //cors 문제 해결



app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
  logger.info('GET / ');
});

  
var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.info('Server listening on port 3000');
  console.log('Server is working : PORT - ',port);
});

module.exports = app;
