var express = require('express');
var reload = require('reload');
var app = express();

app.set('port', 8080 );
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = 'CA Lottery Scratcher Odds';

app.use(express.static('app/public'));
app.use(require('./routes/index'));

var server = app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'));
});

reload(app);
