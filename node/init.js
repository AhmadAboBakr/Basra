/**
* @author: Ahmed Maged
* Date: 7/7/13 - 9:39 PM
*
* This file contains the code that initializes tha application
*
*/
exports.gamelib = require('./game.js');
exports.express = require('express');
exports.fs = require('fs');
exports.app = exports.express();
exports.server = require('http').createServer(exports.app);
exports.io = require('socket.io').listen(exports.server);
exports.io.set('log level', 1);

exports.app.set('view engine', 'html'); exports.app.set('views',__dirname + "/../client");
exports.app.use(exports.express.static(__dirname + '/../client'));
exports.app.use(exports.express.bodyParser());

/**
* This contains all rooms, players inside are just socket ids indexed by player position
*/
exports.rooms = {};
var helper = {};
helper.util = require('./helpers/util.js');

/**
* Full player data is here
*/
helper.game = require('./helpers/game.js');
exports.helper = helper;
exports.allSockets = {}; //all sockets keyed by socket id
exports.handlers = require('./handlers.js');
exports.routings = require('./routing.js');
