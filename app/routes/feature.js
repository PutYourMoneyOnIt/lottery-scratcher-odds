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

var output = '';
var columns = 'GameNumber, Name, price, Odd, TotalWinners, PrizeClaimed, PrizeAvailable';
var table = 'gameodds';
var match = 'price';
var inputMatch = 10; // TBD, default for now $10 prize
var orderBy = 'Odd';
var limit = 10;
var lastUpdate = ''

router.get('/feature', (req, res) => {
    executeQuery("SELECT lastUpdate FROM " + table + 
        " WHERE " + match + " = " + inputMatch + 
        " LIMIT 1",
        function(result) {
            res.render('feature', {
                pageTitle: 'Feature',
                pageID: 'feature',
                tableData: output,
                lastUpdate: lastUpdate
            });
            lastUpdate = 'Last update: ' + dateFormat(result[0].lastUpdate, "ddd mmm dd yyyy");
        });
});

router.get('/update-feature', (req, res) => {
    output = '';
    inputMatch = req.query.prizeAmt;
    if (inputMatch === undefined || inputMatch == '') {
        inputMatch = 10; // default value?
    } 

    executeQuery("SELECT " + columns + " FROM " + table + 
        " WHERE " + match + " = " + inputMatch + 
        " ORDER BY " + orderBy + " ASC" + 
        " LIMIT " + limit,
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

            res.render('feature', {
                pageTitle: 'Feature',
                pageID: 'feature',
                tableData: output,
                lastUpdate: lastUpdate
            });
        });
});

module.exports = router;
