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

var output = '';
var lastUpdate = '';

executeQuery("call GameReturnValue;",
    function(result) {
        lastUpdate = dateFormat(result[0].lastUpdate, "ddd mmm dd yyyy");
    });

router.get('/return-value', (req, res) => {
    executeQuery("call GameReturnValue;", 
        function(result) {
            result = result[0];
            
            output = ''
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

            res.render('return-value', {
                pageTitle: 'Return Value',
                pageID: 'return-value',
                tableData: output,
                lastUpdate: 'Last update: ' + lastUpdate
            });
        });
});

module.exports = router;
