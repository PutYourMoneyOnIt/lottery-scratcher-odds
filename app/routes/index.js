var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'appuser',
  password: 'C$575app',
  database: 'scracherdev'
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
});

// Executes queries on declared db (it can be extended if you want to use more than one db)
function executeQuery(sql, cb) {
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        cb(result);
    });
}

var table = 'game';
var output = '';
var lastUpdate = '';
var orderBy = 'TicketPrice';
var columns = 'GameNumber, TicketPrice, Name, TopPrize, TotalWinners, PrizeClaimed, PrizeAvailable';

executeQuery("SELECT " + columns + " FROM " + table + 
    " ORDER BY " + orderBy + " ASC", 
    function(result) {
        output += '<table class="table table-hover">\n';
        output += '<thead>\n';
        output += '<tr>\n';
        for(var column in result[0]) {
            output += '<th scope="col">' + column + '</td>\n';
        }
        output += '</tr>\n';
        output += '</thead>';
        output += '<tbody>\n';
        for(var row in result) {
            output += '<tr class="table-light">\n';
            for(var column in result[row]) {
            output += '<td>' + result[row][column] + '</td>\n';
            }
            output += '</tr>\n';
        }
        output += '</tbody>\n';
        output += '</table>\n';
});

executeQuery("SELECT lastUpdate FROM " + table + 
    " LIMIT 1",
    function(result) {
        lastUpdate = dateFormat(result[0].lastUpdate, "ddd mmm dd yyyy");
    });

router.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Home',
        pageID: 'home',
        tableData: output,
        lastUpdate: 'Last update: ' + lastUpdate
    });
});

module.exports = router;
