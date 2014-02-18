/**
* @author: Ahmed Maged
* Date: 7/7/13 - 9:39 PM
*
* This file contains the code that initializes tha application
*
*/
exports.env = process.argv.slice(2,3) || 'dev';
exports.gamelib = require('./game.js');
exports.express = require('express');
exports.fs = fs = require('fs');
exports.app = exports.express();
if( 'dev' === exports.env ){
    exports.server = require('http').createServer(exports.app);
}
else{
    var sslOptions = {
        key: fs.readFileSync('../../../ssl/server.key'),
        cert: fs.readFileSync('../../../ssl/server.crt'),
        ca: fs.readFileSync('../../../ssl/ca.crt'),
        requestCert: true,
        rejectUnauthorized: false
    };
    exports.server = require('https').createServer(sslOptions,exports.app);
}

exports.io = require('socket.io').listen(exports.server);
exports.io.set('log level', 1);

exports.app.set('view engine', 'html'); exports.app.set('views',__dirname + "/../public");
exports.app.use(exports.express.static(__dirname + '/../public'));
exports.app.use(exports.express.bodyParser());
exports.requirejs = require('requirejs');
exports.gameCommon = require('../public/js/game.js');

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
