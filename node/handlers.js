/**
* @author: Ahmed Maged
* Date: 7/7/13 - 9:39 PM
*
* This file contains all the event handlers, synonymous to controllers in MVC
*
*/

var glob = require('./init.js');

var gamelib = glob.gamelib;

var io = glob.io;

var allSockets = glob.allSockets;

/**
 * @type Room
 */
var room = require('./classes/room.js').Room;

/**
 * An object containing rooms keyed by room id
 * @type {}
 */
var rooms = glob.rooms;

/**
 * timeout timer id
 */
var turnTimeout;

/**
 * number of timeouts before kicking a player from the room
 * @type {number}
 */
var timeoutsBeforeKick = 2;

/**
 * number of seconds the player should play before
 * @type {number}
 */
var secondsBeforeTimeout = 9;

/**
 * number of seconds before a machine plays
 * @type {number}
 */
var machineDelay = 1.5;


/**
 * Creates a new room
 *
 * @param data
 * @param socket
 */
exports.create_room_handler = function(data,socket){
    var game = new gamelib.game();
    var room_id = glob.helper.util.make_id();
    game.init();
    rooms[room_id] = new room(game,[],data);
    io.sockets.emit('room_created',{ room_id: room_id, name: data });
};

exports.reset_handler = function(room_id){
    var game = new gamelib.game();
    game.init();
    rooms[room_id].game = game;
    for (var i = rooms[room_id].players.length - 1; i >= 0; i--) {
        io.sockets.socket(rooms[room_id].players[i]).emit('start',game.getStateFor(i));
    }
};

exports.start_handler = function (data,socket) {  //new player wants to join
    allSockets[socket.id] = socket; //save the socket for later reference
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
 * !socket is overloaded in recursive calls
 * A game step, either a player or a machine should play
 *
 * data:
 *     In recursive calls, it should be { player: -1, card: -1} for both machines and timed out players,
 *     In normal calls, it should be { player: int, card: int }
 *
 * socket:
 *     In normal calls, this should be the actual socket
 *     In recursive calls, this should be { room_id: int , player_id: -1 } for machines,
 *                                        { room_id: int , player_id: socket } for timed out players
 *
 * timeout: bool, true for timed out players
 *
 * @param data
 * @param socket
 * @param timeout
 */
exports.step_handler = function (data,socket,timeout) { //card played ( human ), or play a card ( machine )

    timeout = timeout || false;

    /**
     * in recursive calls, this should be either:
     * { room_id: string, player_id: -1 } for machines, or
     * { room_id: string, player_id: socket } for timed out players
     *
     * in normal calls, this should be:
     * { room_id: string , player_id: int (player index) }
     *
     * @type {}
     */
    var player_data = (undefined !== socket.player_id)?socket:glob.helper.game.get_player(socket.id);

    /**
     * the player's index in players array
     */
    var player = data.player !== -1 ? player_data.player_id: -1;

    /**
     * @type string | int
     */
    var room = player_data.room_id;

    /**
     * index of the next player in the game
     * @type int
     */
    var next_player_id;

    /**
     * socket id of the next player
     * @type string
     */
    var next_player;

    /**
     * @type Game
     */
    var game;

    /**
     * current player's index in the game
     * @type int
     */
    var currentPlayerIndex;

    /**
     * could be one of three:
     * 1. if we are dealing a new game, then: Object containing: [] players, Table table.
     * 2. if this is not this player's turn, then: -1
     * 3. normal:
     *    Object containing:
     *        timeouts,
     *        new_deal,
     *        players,
     *        table,
     *        total_turns,
     *        cardPlayed,
     *        cardCollected
     *
     */
    var step;

    /**
     * Object containing players, table.
     * players is an object containing:
     * {
     *  me: {score,hand:[{color,number}*],name},
     *  int(0-4): {score, hand:int, name},
     *  int(0-4): {score, hand:int, name},
     *  int(0-4): {score, hand:int, name}
     *  }
     */
    var currentPlayer;

    if(room === -1) return; //player not found in any room

    game = rooms[room].game;

    if( typeof socket.player_id === 'object' && socket.player_id.id ){ //if this is a player timeout, return the overloaded socket to its normal
        socket = socket.player_id;
    }

    if(game.totalTurns === 48){
        io.sockets.in(room).emit( //no more cards
            'endOfGame',
            {
                scores: game.getScores().scores,
                names: game.getScores().names
            }
        );
        return;
    }
    currentPlayerIndex = game.turn;
    step = JSON.parse(game.step(player,data.card,timeout));
    if(-1 === step){
        return; //wrong turn
    }
    currentPlayer = game.getStateFor(currentPlayerIndex); //full data for this player

    //todo is this going to work when several games are running simultaneously?
    clearTimeout(turnTimeout);

    if(step.timeouts>timeoutsBeforeKick){
        socket.leave(room);
    }

    if(socket && socket.id){ //if not a machine
        io.sockets.socket(socket.id).emit('updatePlayer',currentPlayer); //update the playing player
    }
    io.sockets.in(room).emit( //notify and update all others
        'update',
        {
            table      : game.table,
            whoPlayed  : {
                index : game.turn-1 < 0 ? 3:game.turn-1, //the guy who just played
                score : JSON.parse(currentPlayer).players.me.score
            },
            log: {
                name: JSON.parse(currentPlayer).players.me.name,
                cardPlayed: step.cardPlayed,
                cardsCollected: step.cardsCollected
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
    if(game.totalTurns === 48){
        io.sockets.in(room).emit( //no more cards
            'endOfGame',
            {
                scores: game.getScores().scores,
                names: game.getScores().names
            }
        );
        return;
    }

    //------------ handle the next turn -------------//

    next_player_id = game.turn; //next player index
    next_player = glob.rooms[room].players[next_player_id]; //next player socket id

    if( undefined === next_player){ //Machine's turn
        //machine, wait a couple of secs, play, then get next and repeat
        setTimeout(function(){
            exports.step_handler(
                { player: -1, card: -1 },
                { room_id:room, player_id: -1 }
                ,false
            );
        },machineDelay*1000);
    }
    else{
        //player, tell him it's his turn
        io.sockets.socket(next_player).emit('your_turn');
        turnTimeout = setTimeout(function(){
            exports.step_handler(
                {player:-1,card:-1},
                {
                    player_id: allSockets[game.players[game.turn]['socket_id']], //the socket of the next player
                    room_id: room
                },
                true
            );
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
