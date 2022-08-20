
const connection  = require('./config/mysql.js');

var name = "SELECT EXISTS (select 1 \n  from Class \n where School = '마산용마고' and grade = 2 and class = 6)"

connection.query("select *\n from Class \n where School = 'a' and grade = 2 and class = 6 LIMIT 1", 
        function (error, results, fields) {

          if (error) throw error;
          console.log(results[0]);

        })

