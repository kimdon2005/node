const mysql      = require('mysql');

const connection = mysql.createConnection({
  host     : '127.0.0.1',
  port     :  '3306',
  user     : 'root',
  password : '1020',
  database : 'doitnow'
});

module.exports = connection;
