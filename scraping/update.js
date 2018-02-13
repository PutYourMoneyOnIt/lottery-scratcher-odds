var odds = require('./odds.json');//loads json data into odds
var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'appuser',
    password: 'C$575app',
    database: 'scracherdev'
});

db.connect(function(err){
    if(err) throw err;
    console.log("Connected to Database!");
});

// Executes queries on declared db (it can be extended if you want to use more than one db)
function executeQuery(sql, cb) {
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        cb(result);
    });
}

var game = odds.game; //isolating the game json object
//looping through games to obtain all the information
for (gaN in game){
    var t = game[gaN];
    gn = t.GameNumber;
    tp = t.TicketPrice;
    name = t.Name;
    top = t.TopPrize;
    tw = t.TotalWinners;
    pc = t.PrizeClaimed;
    pa = t.PrizeAvailable;
    //query to insert game into table, if game exist it will update prizes claimed and prize available
    executeQuery("INSERT INTO game (GameNumber, TicketPrice, Name, TopPrize, TotalWinners, PrizeClaimed, PrizeAvailable) "
    + "VALUES ("+gn+", "+tp+", \'"+name+"\', "+top+", "+tw+", "+pc+", "+pa+")"
    + "ON DUPLICATE KEY UPDATE PrizeClaimed="+pc+", PrizeAvailable="+pa, function(result){
    })
}

process.exit();//exit script