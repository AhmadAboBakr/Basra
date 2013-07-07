var glob = require('./init.js');
var app = glob.app;
var fs = glob.fs;

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
