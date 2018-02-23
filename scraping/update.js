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

async function updatedb(){
    var game = odds.game; //isolating the game json object
    var gameOdds = odds.gameodds; //isolating the gameodds json object
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
    await executeQuery("TRUNCATE TABLE gameOdds");
    for(gaO in gameOdds){
        var t = gameOdds[gaO];
        gn = t.GameNumber;
        pr = t.price;
        od = t.Odd;
        tw = t.TotalWinners;
        pc = t.PrizeClaimed;
        pa = t.PrizeAvailable;
        name = t.Name;


        executeQuery("INSERT INTO gameodds (GameNumber, prize, Odd, TotalWinners, PrizeClaimed, PrizeAvailable, Name, lastUpdate) "
        + "VALUES ("+gn+", "+pr+", "+od+", "+tw+", "+pc+", "+pa+", \'"+name+"\', now()) " 
        + "ON DUPLICATE KEY UPDATE PrizeClaimed="+pc+", PrizeAvailable="+pa, function(result){
        })

        // executeQuery(`INSERT INTO gameodds (GameNumber, price, Odd, TotalWinners, PrizeClaimed, PrizeAvailable, Name) `
        // + `VALUES (${parseInt(gn)}, "${pr}", ${parseInt(od)}, ${parseInt(tw)}, ${parseInt(pc)}, ${parseInt(pa)}, "${name}") `
        // + `ON DUPLICATE KEY UPDATE PrizeClaimed=${parseInt(pc)}, PrizeAvailable=${parseInt(pa)}`, function(result){
        // })
    }
}
updatedb();
process.exit();//exit script