/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/22/13
 * Time: 11:39 PM
 */
var game = {};
var socket = io.connect('http://localhost:3000');
function updateTable(){
    var table = $("#table");
    var numOfCardsOnTable = table.children("div").length;
    if(numOfCardsOnTable < 7){
        table.find(".card").css('margin','5px');
    }
    else{
        table.find(".card").css('margin','-15');
    }
}
function render(data){
    if(!data.hasOwnProperty("players"))return;
    console.log(data);
    var html;
    var playerNum;
    for(var i=0;i<4;++i){
        if(!data.players[i])
        {
            playerNum = i;
            continue;
        }
        html = "<p class='pname'>"+data.players[i].name+' : '+data.players[i].score+"</p>";
        for(var j=0;j<data.players[i].hand;j++){
            html += '<div class="cardInvisible"></div>';
        }
        $($(".player")[i]).html(html);
    }
    html = "<p class='pname'>"+data.players['me'].name +' : '+data.players['me'].score+"</p>";
    for(j=0;j<data.players['me'].hand.length;j++){
        var id="me_"+j;
        html += '<div class="card '+data.players['me'].hand[j].color+data.players['me'].hand[j].number+'" id="'+id+'"></div>';
    }
    $($(".player")[playerNum]).html(html);
    var table =$("#table");
    table.html("");
    for(var k =0; k < data.table.cards.length ; ++k){
        table.html(function(index,oldHtml){
            return oldHtml + '<div class="card '+data.table.cards[k].color+data.table.cards[k].number+'"></div>';
        });
    }
    updateTable();
}
function renderOld(data){
    if(!data.hasOwnProperty("players")){alert('error');return;}
    for(var i=0;i<4;++i){
        var player = $("#player"+i);
        var html = "<p class='pname'>"+data.players[i].name+' : '+data.players[i].score+"</p>";
        for(var j=0;j<data.players[i].hand.length;j++){
            var id=""+i+"_"+j;
            html += '<div class="card '+data.players[i].hand[j].color+data.players[i].hand[j].number+'" id="'+id+'"></div>';
        }
//        html += '<p class="pscore" style="float: none;">Score : '+data.players[i].score+'</p><div style="clear: both;"></div>';
        player.html(html);
    }
    var table =$("#table");
    table.html("");
    for(var k =0; k < data.table.cards.length ; ++k){
        table.html(function(index,oldHtml){
            return oldHtml + '<div class="card '+data.table.cards[k].color+data.table.cards[k].number+'"></div>';
        });
    }
    updateTable();
}

socket.emit('start');
socket.on('start',function(data){
    render(JSON.parse(data));
    console.log(data);
});
socket.on('tableChange',function(data){
    console.log(data);
    var table =$("#table");
    table.html("");
    for(var k =0; k < data.cards.length ; ++k){
        table.html(function(index,oldHtml){
            return oldHtml + '<div class="card '+data.cards[k].color+data.cards[k].number+'"></div>';
        });
    }
    updateTable();
});
socket.on('updates', function (data) {
    render(JSON.parse(data));
    console.log(data);
});

$(document).on("click",".card",function(){
    var id_array= $(this).attr("id").split("_");
    socket.emit('step', {player:id_array[0],card:id_array[1]});
});
