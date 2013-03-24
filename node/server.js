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

//make a new game --should be done when new room is created, when we start implementing rooms
game = new gamelib.game();
game.init();

io.sockets.on('connection',function(socket){
    socket.on('start', function (data) {
        if(playerSessionIDMap.length < 4 && playerSessionIDMap.indexOf(socket.id)==-1){
            playerSessionIDMap.push(socket.id);
            console.log(playerSessionIDMap.indexOf(socket.id));
            io.sockets.socket(socket.id).emit('start',game.getStateFor(playerSessionIDMap.indexOf(socket.id)));
        }
        else{
            io.sockets.emit('start',game.getStateOf(playerSessionIDMap.indexOf(socket.id)));
        }
    });
    socket.on('step', function (data) {
        var player = data.player !== -1 ? playerSessionIDMap.indexOf(socket.id) : -1;
        var step = game.step(player,data.card);
        var currentPlayer=game.getStateFor(playerSessionIDMap.indexOf(socket.id));
        io.sockets.socket(socket.id).emit('updatePlayer',currentPlayer);
        console.log(currentPlayer);
        io.sockets.emit('update',{table:game.table,whoPlayed:{index:data.player,score:JSON.parse(currentPlayer).players.me.score}});

    });
});

app.get('/',function(req, res){
    fs.readFile(__dirname + '/../client/basra.html', 'utf8', function(err, text){
        res.send(text);
    });
});
server.listen(3000);
