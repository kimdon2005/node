const express = require('express');
const path = require('path'); //get path
const bodyParser = require("body-parser"); //import body-parser
const connection   = require('./config/mysql.js');
var router_1 = require('./router/firebase_route.js');

// import express from "express";
const app = express(); // define instance of express



var port = "3000";  // set port number
app.set('port', port); 

app.use(express.static(path.join(__dirname, "clienat/build"))); // define to use that path file
app.use('/firebase',router_1);

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
});


app.get('/users', (req, res) => {
  connection.query('SELECT * from people', (error, rows) => {
    if (error) throw error;
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
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});


  
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('Server is working : PORT - ',port);
});

module.exports = app;
