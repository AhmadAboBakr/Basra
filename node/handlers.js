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
var turnTimeout; //timeout timer id
var timeoutsBeforeKick = 2; //number of timeouts before kicking a player from the room
var secondsBeforeTimeout = 5; //number of seconds the player should play before
var machineDelay = 1; //number of seconds before a machine plays


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
            }
        }
        else if( player_number === -1){
            io.sockets.socket(socket.id).emit('start',game.getStateForWatcher());
        }
        //else if player_num === -2 , do nothing
    }
};
/**
 * !socket is overloaded in recursing calls
 * A game step, either a player or a machine should play
 *
 * @param data
 * @param socket
 * @param timeout
 */
exports.step_handler = function (data,socket,timeout) { //card played ( human ), or play a card ( machine )
    console.log(data);
    timeout = timeout || false;
    var player_data = data.player !== -1 ?glob.helper.game.get_player(socket.id):socket;
    var player = data.player !== -1 ? player_data.player_id: -1; //the player's index in players array
    var room = player_data.room_id;

    if(room === -1) return; //player not found in any room

    var game = rooms[room].game;
    var step = JSON.parse(game.step(player,data.card,timeout));
    var currentPlayer = game.getStateFor(player); //full data for this player
    clearTimeout(turnTimeout);
    
    if(step.timeouts>timeoutsBeforeKick){
        socket.leave(room);
    }

    if(player !== -1){
        io.sockets.socket(socket.id).emit('updatePlayer',currentPlayer); //update the playing player
    }

    io.sockets.in(room).emit( //notify and update all others
        'update',
        {
            table      : game.table,
            whoPlayed  : {
                index : game.turn-1 < 0 ? 3:game.turn-1, //the guy who just played
                score : JSON.parse(currentPlayer).players.me.score
            }
        }
    );
    if(step.new_deal){
        for (var i = rooms[room].players.length - 1; i >= 0; i--) {
            io.sockets.socket(rooms[room].players[i]).emit('start',game.getStateFor(i));
        }
    }
//    if(step.timeouts == timeoutsBeforeKick){
//        socket.disconnect = true;
//        this.disconnect_handler(null,socket);
//    }
        
    var next_player_id = game.turn; //next player index
    var next_player = glob.rooms[room].players[next_player_id]; //next player socket id

    if( undefined === next_player){ //Machine's turn
        //machine, wait a couple of secs, play, then get next and repeat
        setTimeout(function(){
            exports.step_handler({player:-1,card:-1},{room_id:room,player_id:-1});
        },machineDelay*1000);
    }
    else{
        //player, tell him it's his turn
        io.sockets.socket(next_player).emit('your_turn');
        turnTimeout = setTimeout(function(){
            if(game.totalTurns == step.totalTurns){
                var player_index = glob.helper.game.get_player(JSON.parse(currentPlayer).players.me.socket_id).player_id;
                exports.step_handler(
                    {player:player_index,card:-1},
                    socket,
                    true
                );
            }
        },secondsBeforeTimeout*1000);
    }

};
exports.get_rooms_handler = function (data, socket){
    io.sockets.socket(socket.id).emit('rooms',rooms);
};
exports.disconnect_handler = function (data, socket) { //player leaving, clear his place and get him out
    var player = glob.helper.game.get_player(socket.id);
    var room_id = player.room_id;
    var player_data = {};

    if(room_id !== -1)
    {
        glob.helper.game.set_player_name(socket.id,"machine");
        var p_index = rooms[room_id].players.indexOf(socket.id);
        var room = rooms[room_id];
        var game = room.game;
        delete rooms[room_id].players[p_index];
        player_data.index = p_index;
        player_data.name = game.players[p_index].name;
        game.players[p_index].timeouts = 0;
        io.sockets.in(room_id).emit('player_disconnected',player_data);

        for (var i = room.players.length - 1; i >= 0; i--) {
            io.sockets.socket(room.players[i]).emit('start',game.getStateFor(i));
        }
    }
};
