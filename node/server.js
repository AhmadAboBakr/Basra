var gamelib = require('./game.js');
var game;
var express = require('express');
var fs = require('fs');
var app = express();
app.set('view engine', 'html'); app.set('views', "../client");
app.use(express.static('../client'))
app.get('/start', function(req, res){
    game= new gamelib.game();
    var body=game.init();
    res.send(body);
});

app.get('/step', function(req, res){
    var body=game.step();
//    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

app.get('/',function(req, res){
    fs.readFile(__dirname + '/../client/basra.html', 'utf8', function(err, text){
        res.send(text);
    });
});
app.listen(3000);
