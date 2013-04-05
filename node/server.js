var gamelib = require('./game.js');
var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('view engine', 'html'); app.set('views', "../client");
app.use(express.static('../client'));
app.use(express.bodyParser());

var rooms = {};

function make_id()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * returns -1 if room is full, -2 for existing players, player number for a successfull new player
 * @param socket_id
 * @param room room id
 * @return {Number}
 */
function add_player(socket_id,room){
    var i = 0;
    if( rooms[room].players.indexOf(socket_id) !== -1 )
        return -2;
    for( i=0 ; i<rooms[room].players.length ; ++i ){
        if( !rooms[room].players[i] ){
            rooms[room].players[i] = socket_id;
            return i;
        }
    }
    if(rooms[room].players.length < 4){
        rooms[room].players.push(socket_id);
        return rooms[room].players.length - 1;
    }
    return -1;
}
var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
};

function get_player(socket_id){
    var rid = -1;
    var pid = -1;
    if(!isEmpty(rooms)){
        for( var room_id in rooms){
            if(!rooms.hasOwnProperty(room_id))
                continue;
            if(rooms[room_id].players.indexOf(socket_id) !== -1){
                rid = room_id;
                pid = rooms[room_id].players.indexOf(socket_id);
            }
        }
    }
    return {room_id:rid,player_id:pid};
}


io.sockets.on('connection',function(socket){

    socket.on('create_room',function(data){
        var game = new gamelib.game();
        var room_id = make_id();
        game.init();
        rooms[room_id] = {game:game,players:[]};
        io.sockets.socket(socket.id).emit('room_created',{room_id:room_id});
        console.log(rooms);
    });

    socket.on('start', function (data) {
        var player_number = add_player(socket.id,data.room);
        var game = rooms[data.room].game;
        if( player_number > -1 ){
            io.sockets.socket(socket.id).emit('start',game.getStateFor(player_number));
        }
        else if( player_number === -1){
            io.sockets.socket(socket.id).emit('start',game.getStateForWatcher());
        }
        //else if player_num === -2 , do nothing
    });
    socket.on('step', function (data) {
        var player_data = get_player(socket.id);
        var player = data.player !== -1 ? player_data.player_id: -1;
        var room = player_data.room_id;
        if(room === -1) return; //player not found in any room
        var game = rooms[room].game;
        var step = game.step(player,data.card);
        var currentPlayer = game.getStateFor(player);
        io.sockets.socket(socket.id).emit('updatePlayer',currentPlayer);
        io.sockets.emit('update',{table:game.table,whoPlayed:{index:data.player,score:JSON.parse(currentPlayer).players.me.score}});
    });
    socket.on('get_rooms', function () {
        io.sockets.socket(socket.id).emit('rooms',rooms);
    });
    socket.on('disconnect', function () {
//        var player = get_player(socket.id);
//        var room = player.room_id;
//        delete rooms[room].players.indexOf(socket.id);
    });
});

app.get('/rooms',function(req, res){
    fs.readFile(__dirname + '/../client/rooms.html', 'utf8', function(err, text){
        res.send(text);
    });
});
app.get('/basra',function(req, res){
    fs.readFile(__dirname + '/../client/basra.html', 'utf8', function(err, text){
        res.send(text);
    });
});
server.listen(3000);
