var mysql = require('mysql');
var db = mysql.createConnection({
 host:'localhost',
 user:'root',
 password:'qwer1234',
 database:'eh_midt',
 port : '3307'
});
db.connect();
module.exports = db;
