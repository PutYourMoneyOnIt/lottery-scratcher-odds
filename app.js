var express = require('express')
var app = express()
var http = require('http').Server(app)
var fs = require('fs')
var mysql = require('mysql')

app.use(express.static(__dirname))

var server = http.listen(8080, () => {
    console.log('server is listening on port', server.address().port)
    saveTable()
})

var db = mysql.createConnection({
  host: 'localhost',
  user: 'appuser',
  password: 'C$575app',
  database: 'scracherdev'
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!")
});

// Executes queries on declared db (it can be extended if you want to use more than one db)
function executeQuery(sql, cb) {
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        cb(result);
    });
}

// save db table to html file db-table.html
function saveTable(){
  var table = "game"
  var output = ""

  // get specified table
  executeQuery("SELECT * FROM " + table, function(result){
    output += "<table border=\"2px\" cellpadding=\"5\">\n";
    output += "<tr>\n";
    for(var column in result[0]){
      output += "<td><label>" + column + "</label></td>\n";
    }
    output += "</tr>\n";
    for(var row in result){
      output += "<tr>\n";
      for(var column in result[row]){
          output += "<td><label>" + result[row][column] + "</label></td>\n";
      }
      output += "</tr>\n";
    }
    output += "</table>\n";

    fs.writeFile('db-table.html', output, function(err){
      if (err) throw err;
      console.log("we saved the file!")
    })
  });
}
