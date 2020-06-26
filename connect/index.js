let mysql = require('mysql');
let connection = mysql.createConnection({
  host: '10.0.88.77',
  user: 'root',
  password: '123456',
  database: 'collaboration_platform'
});
module.exports = connection;