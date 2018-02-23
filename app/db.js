const mysql = require('mysql');
const settings = require('./settings.json');
var db;

function connectDatabase () {
  if (!db) {
    db = mysql.createConnection(settings);

    db.connect((err) => {
      if (err) throw err
      console.log('Database is connected!');
    })
  }
  return db;
}

module.exports = connectDatabase();
