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

/**
 * returns -1 if room is full, -2 for existing players, player number for a successfull new player
 * @param socket_id
 * @return {Number}
 */
function get_add_player(socket_id){
    var i = 0;
    if( playerSessionIDMap.indexOf(socket_id) !== -1 )
        return -2;
    for( i=0 ; i<playerSessionIDMap.length ; ++i ){
        if( !playerSessionIDMap[i] ){
            playerSessionIDMap[i] = socket_id;
            return i;
        }
    }
    if(playerSessionIDMap.length < 4){
        playerSessionIDMap.push(socket_id);
        return playerSessionIDMap.length - 1;
    }
    return -1;
}


io.sockets.on('connection',function(socket){

    socket.on('start', function (data) {
        var player_number = get_add_player(socket.id);
        if( player_number > -1 ){
            io.sockets.socket(socket.id).emit('start',game.getStateFor(player_number));
        }
        else if( player_number === -1){
            io.sockets.socket(socket.id).emit('start',game.getStateForWatcher());
        }
        //else if player_num === -2 , do nothing
        console.log(playerSessionIDMap);
    });
    socket.on('step', function (data) {
        var player = data.player !== -1 ? playerSessionIDMap.indexOf(socket.id) : -1;
        var step = game.step(player,data.card);
        var currentPlayer = game.getStateFor(playerSessionIDMap.indexOf(socket.id));
        io.sockets.socket(socket.id).emit('updatePlayer',currentPlayer);
        io.sockets.emit('update',{table:game.table,whoPlayed:{index:data.player,score:JSON.parse(currentPlayer).players.me.score}});
    });
    socket.on('disconnect', function () {
        delete playerSessionIDMap[playerSessionIDMap.indexOf(socket.id)];
    });
});

app.get('/',function(req, res){
    fs.readFile(__dirname + '/../client/basra.html', 'utf8', function(err, text){
        res.send(text);
    });
});
server.listen(3000);
