const express = require('express');
const path = require('path');

// import express from "express";
const app = express();

var port = "3000";
app.set('port', port);

app.use(express.static(path.join(__dirname, "client/build")));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
});

app.get('/test/', function (req, res) {
  res.send('Hello aeihfeheioe');
});
  
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('Server is working : PORT - ',port);
});

module.exports = app;
