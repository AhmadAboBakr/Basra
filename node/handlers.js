/**
* @author: Ahmed Maged
* Date: 7/7/13 - 9:39 PM
*
* This file contains all the event handlers, synonymous to controllers in MVC
*
*/

var glob = require('./init.js');
var rooms = glob.rooms;
var gamelib = glob.gamelib;
var io = glob.io;


exports.create_room_handler = function(data,socket){
    var game = new gamelib.game();
    var room_id = glob.helper.util.make_id();
    game.init();
    rooms[room_id] = {game:game,players:[],name:data};
    io.sockets.emit('room_created',{room_id:room_id,name:data});
};

exports.start_handler = function (data,socket) {  //new player wants to join
        
    if(typeof data.room == 'undefined' || typeof rooms[data.room] == 'undefined'){
        io.sockets.socket(socket.id).emit('invalid_room');
    }
    else {
        var player_number = glob.helper.game.add_player(socket,data.room);
        var game = rooms[data.room].game;
        var room = rooms[data.room];
        if( player_number > -1 ){
            io.sockets.socket(socket.id).emit('start',game.getStateFor(player_number));
            for (var i = room.players.length - 1; i >= 0; i--) {
                io.sockets.socket(room.players[i]).emit('start',game.getStateFor(i));
            };
        }
        else if( player_number === -1){
            io.sockets.socket(socket.id).emit('start',game.getStateForWatcher());
        }
        //else if player_num === -2 , do nothing
    }
}
exports.step_handler = function (data,socket) { //card played, or play a card

    var player_data = glob.helper.game.get_player(socket.id);
    var player = data.player !== -1 ? player_data.player_id: -1;
    var room = player_data.room_id;

    if(room === -1) return; //player not found in any room

    var game = rooms[room].game;
    var step = game.step(player,data.card);
    var currentPlayer = game.getStateFor(player);

    io.sockets.socket(socket.id).emit('updatePlayer',currentPlayer);
    io.sockets.in(room).emit(
        'update',
        {
            table      : game.table,
            whoPlayed  : {
                index : data.player,
                score : JSON.parse(currentPlayer).players.me.score
            }
        }
    );
}
exports.get_rooms_handler = function (data, socket){
    io.sockets.socket(socket.id).emit('rooms',rooms);
}
exports.disconnect_handler = function (data, socket) { //player leaves, clear his place and get him out of here
    var player = glob.helper.game.get_player(socket.id);
    var room_id = player.room_id;
    if(room_id !== -1)
    {
        glob.helper.game.set_player_name(socket.id,"machine");
        var p_index = rooms[room_id].players.indexOf(socket.id);
        var room = rooms[room_id];
        var game = room.game;
        delete rooms[room_id].players[p_index];
        console.log(rooms[room_id].players);
        io.sockets.in(room_id).emit('player_disconnected',{player_id:p_index});

        for (var i = room.players.length - 1; i >= 0; i--) {
                io.sockets.socket(room.players[i]).emit('start',game.getStateFor(i));
            };
    }
}

