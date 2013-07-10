/**
* @author: Ahmed Maged
* Date: 7/7/13 - 9:39 PM
*
* This file contains the game specific helpers.
*
*/
var glob = require('../init.js');
var rooms = glob.rooms;

/**
 * Adds a player to a room
 * returns -1 if room is full, -2 for existing players, player number for a successfull new player
 * @param socket
 * @param room room id
 * @return {Number}
 */
exports.add_player = function(socket,room){

    var i = 0;
    var player_id = -1; //room full, can't add player ( until proven otherwise )
    var socket_id = socket.id;

    if( rooms[room].players.indexOf(socket_id) !== -1 ) //player already exists
        return -2;

    for( i=0 ; i<rooms[room].players.length ; ++i ){
        //if there is an empty place in already defined indexes, i.e. another player has left the room
        if( !rooms[room].players[i] ){
            rooms[room].players[i] = socket_id;
            player_id = i;
            break;
        }
    }

    //if room was never full, is not full, and there are no empty places to fill, append the player to the end
    if(rooms[room].players.length < 4 && player_id === -1){
        rooms[room].players.push(socket_id);
        player_id = rooms[room].players.length - 1;
    }

    rooms[room].game.players[player_id].name = socket_id;
    socket.join(room);

    return player_id;
}


/**
 * Get player info {room id , player id in the room}
 * @param socket_id
 * @return {Object}
 */
exports.get_player = function(socket_id){
    var rid = -1;
    var pid = -1;

    if(!glob.helper.util.isEmpty(rooms)){
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

