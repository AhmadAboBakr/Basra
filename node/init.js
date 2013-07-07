exports.gamelib = require('./game.js');
exports.express = require('express');
exports.fs = require('fs');
exports.app = exports.express();
exports.server = require('http').createServer(exports.app);
exports.io = require('socket.io').listen(exports.server);
exports.io.set('log level', 1);

/*var SessionSockets = require('session.socket.io')
    , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);*/

exports.app.set('view engine', 'html'); exports.app.set('views', "../client");
exports.app.use(exports.express.static('../client'));
exports.app.use(exports.express.bodyParser());

exports.rooms = {};
var helper = {};
helper.util = require('./helpers/util.js');
helper.game = require('./helpers/game.js');
exports.helper = helper;
exports.handlers = require('./handlers.js');
