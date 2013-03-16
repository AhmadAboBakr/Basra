var gamelib = require('./game.js');
var game;
var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var playerSessionIDMap = [];

app.set('view engine', 'html'); app.set('views', "../client");
app.use(express.static('../client'));
app.use(express.bodyParser());

game = new gamelib.game();
game.init();

io.sockets.on('connection',function(socket){
    socket.on('start', function (data) {
        if(playerSessionIDMap.length < 4){
            playerSessionIDMap.push(socket.id);
            io.sockets.emit(game.getStateFor(playerSessionIDMap.indexOf(socket.id)));
        }
        else{
            io.sockets.emit(game.getState());
        }
    });
    socket.on('step', function (data) {
        io.sockets.emit('updates',game.step(data.player,data.card));
    });
});

app.get('/',function(req, res){
    fs.readFile(__dirname + '/../client/basra.html', 'utf8', function(err, text){
        res.send(text);
    });
});
server.listen(3000);
