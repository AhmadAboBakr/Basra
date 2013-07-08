/**
* @author: Ahmed Maged
* Date: 7/7/13 - 9:39 PM
*
* This file contains the routings for the app
*
*/
var glob = require('./init.js');
var app = glob.app;
var fs = glob.fs;
var gamelib = glob.gamelib;
var express = glob.express;
var server = glob.server;
var io = glob.io;


io.sockets.on('connection',function(socket){
    socket.on('create_room',function(data){
        return glob.handlers.create_room_handler(data,socket);
    });
    socket.on('start', function (data) {
        return glob.handlers.start_handler(data,socket);
    });
    socket.on('step', function (data) {
        return glob.handlers.step_handler(data,socket);
    });
    socket.on('get_rooms', function (data) {
        return glob.handlers.get_rooms_handler(data,socket);
    });
    socket.on('disconnect', function(data){
        return glob.handlers.disconnect_handler(data,socket);
    });
});

app.get('/',function(req, res){
    fs.readFile(__dirname + '/../client/rooms.html', 'utf8', function(err, text){
        res.send(text);
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

app.get('/',function(req, res){
    fs.readFile(__dirname + '/../client/rooms.html', 'utf8', function(err, text){
        res.send(text);
    });
});
