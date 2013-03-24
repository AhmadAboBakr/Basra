/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/22/13
 * Time: 11:39 PM
 */
var game = {};
var socket = io.connect('http://localhost:3000');

function updateTable(data){
    var table =$("#table");
    table.html("");
    for(var k =0; k < data.cards.length ; ++k){
        table.html(function(index,oldHtml){
            return oldHtml + '<div class="card '+data.cards[k].color+data.cards[k].number+'"></div>';
        });
    }

    //prevent the cards from overflowing
    var numOfCardsOnTable = table.children("div").length;
    if(numOfCardsOnTable < 7){
        table.find(".card").css('margin','5px');
    }
    else{
        table.find(".card").css('margin','-15');
    }
}
function updateMe(me,myNumber){
    var html = "<p class='pname'>"+me.name +' : '+me.score+"</p>";
    for(j=0;j<me.hand.length;j++){
        var id="me_"+j;
        html += '<div class="card '+me.hand[j].color+me.hand[j].number+'" id="'+id+'"></div>';
    }
    $($(".player")[myNumber]).html(html);
}
function updateOthers(players){
    var html = "";
    players.forEach(function(player,index){
        html = "<p class='pname'>"+player.name+' : '+player.score+"</p>";
        for(var j=0;j<player.hand;j++){
            html += '<div class="cardInvisible"></div>';
        }
        $($(".player")[index]).html(html);
    });
}

function render(data){
    if(!data.hasOwnProperty("players"))return; //nothing to render
    var playerNum; //this player
    var others = [];
    for(var i=0 ; i<4 ; ++i){
        if(data.players[i]){ //this player is called 'me' , all the others are numbered
            others[i] = data.players[i];
        }
        else{ //found the 'me' player, set playerNum to it's number
            playerNum = i;
        }
    }
    updateOthers(others);
    updateMe(data.players['me'],playerNum);
    updateTable(data.table);
}

socket.emit('start');
socket.on('start',function(data){ //begin
    render(JSON.parse(data));
});
socket.on('update',function(data){ //not my turn, update the table, scores, and the hand of the player who just played
    updateTable(data.table);
});
socket.on('updatePlayer', function (data) { //my turn, update everything
    render(JSON.parse(data));
});

$(document).on("click",".card",function(){
    var id_array= $(this).attr("id").split("_");
    socket.emit('step', {player:id_array[0],card:id_array[1]});
});

$(document).on("click","#next",function(){
    socket.emit('step', {player:-1,card:-1});
});
