var express = require('express')
var app = express()
var http = require('http').Server(app)

app.use(express.static(__dirname))

var server = http.listen(8080, () => {
    console.log('server is listening on port', server.address().port)
})
