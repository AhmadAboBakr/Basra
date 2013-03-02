var gamelib = require('./game.js');
var game;
var express = require('express');
var fs = require('fs');
var app = express();
app.set('view engine', 'html'); app.set('views', "../client");
app.use(express.static('../client'));
app.use(express.bodyParser());
app.get('/start', function(req, res){
    game= new gamelib.game();
    res.send(game.init());
});

app.get('/step', function(req, res){
    res.send(game.step(req.query.player,req.query.card));
});

app.get('/',function(req, res){
    fs.readFile(__dirname + '/../client/basra.html', 'utf8', function(err, text){
        res.send(text);
    });
});
app.listen(3000);
