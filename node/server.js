var gamelib = require('./game.js');
var game;
var express = require('express');
var app = express();

app.get('/start', function(req, res){
    game= new gamelib.game();
    var body=game.init();
    res.send(body);
});

app.get('/step', function(req, res){
    var body=game.step();
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Content-Length', body.length);
    res.end('__parseJSONPResponse('+body+");");
});

app.get('/',function(req, res){
    /// this is supposed to send the HTML page with css with client css or maybe remove every thing
});
app.listen(3000);
