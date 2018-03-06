var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');

const db = require('../db');

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

executeQuery("SELECT lastUpdate FROM " + table + 
    " LIMIT 1",
    function(result) {
        lastUpdate = dateFormat(result[0].lastUpdate, "ddd mmm dd yyyy");
    });

router.get('/', (req, res) => {
    columns = 'GameNumber, TicketPrice, Name, TopPrize, TotalWinners, PrizeClaimed, PrizeAvailable';
    table = 'game';
    orderBy = 'TicketPrice';

    executeQuery("SELECT " + columns + " FROM " + table + 
        " ORDER BY " + orderBy + " ASC", 
        function(result) {
            output = '';
            output += '<form method="get" action="/game">\n';
            output += '<table id="allScratchers" class="table table-hover">\n';
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
                    if (result[row]['Name'] == result[row][column]) {
                        output += '<td><p hidden>' + result[row][column] + '</p><input type="submit" class="btn btn-default gameName" value="' + 
                                    result[row][column] + '" name="gameName"></td>\n'; 
                    }
                    else {
                        output += '<td>' + result[row][column] + '</td>\n'; 
                    }
                }
                output += '</tr>\n';
            }
            output += '</tbody>\n';
            output += '</table>\n';
            output += '</form>\n';

            res.render('index', {
                pageTitle: 'Home',
                pageID: 'home',
                tableData: output,
                lastUpdate: 'Last update: ' + lastUpdate,
                backButton: ''
            });
    });
});

router.get('/game', (req, res) => {
    output = '';
    columns = 'GameNumber, Name, prize, Odd, TotalWinners, PrizeClaimed, PrizeAvailable';
    table = 'gameodds';
    inputMatch = req.query.gameName;
    orderBy = 'prize';

    executeQuery("SELECT " + columns + " FROM " + table + 
        " WHERE Name = '"+ inputMatch + "'" +
        " ORDER BY " + orderBy + " DESC", 
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
                    // replace placeholder -1 with Ticket prize
                    if (column === 'prize' && result[row][column] == -1) {
                        result[row][column] = 'Ticket';
                    }
                    output += '<td>' + result[row][column] + '</td>\n';
                }
                output += '</tr>\n';
            }
            output += '</tbody>\n';
            output += '</table>\n';

            res.render('index', {
                pageTitle: 'Home',
                pageID: 'home',
                tableData: output,
                lastUpdate: 'Last update: ' + lastUpdate,
                backButton: '<button type="button" class="btn btn-default" onclick="history.back()">' +
                                '&lt;&lt; Back</button>'
            });
    });
});

module.exports = router;
