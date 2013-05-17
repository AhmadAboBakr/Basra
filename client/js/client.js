/**
 * @author Nookz
 * Date: 2/22/13
 * Time: 11:39 PM
 */
var game = {};
var socket = io.connect('http://localhost:3000');
var watcher = false;

function $_GET(q) {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars[q];
}

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
    var html = "<div class = 'pinfo'><span class='name'>"+me.name +" :</span><span class='score'>"+me.score+"</span></div>";
    for(j=0;j<me.hand.length;j++){
        var id=myNumber+"_"+j;
        html += '<div class="card '+me.hand[j].color+me.hand[j].number+'" id="'+id+'"></div>';
    }
    $($(".player")[myNumber]).html(html);
}
function updateOthers(players){
    var html = "";
    players.forEach(function(player,index){
        html = "<div class='pinfo'><span class='name'>"+player.name +" :</span><span class='score'>"+player.score+"</span></div>";
        for(var j=0;j<player.hand;j++){
            html += '<div class="cardInvisible"></div>';
        }
        $($(".player")[index]).html(html);
    });
}

function updateLastPlayer(player){
        $($(".player")[player.index]).find(".pinfo .score").html(player.score);
        $($(".player")[player.index]).find(".cardInvisible").first().remove();
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
    updateTable(data.table);
    updateOthers(others);
    if(typeof playerNum !== "undefined") //i'm not a watcher
    {
        watcher = false;
        updateMe(data.players['me'],playerNum);
    }
    else{
        watcher = true;
    }
}

socket.emit('start',{room:$_GET('room')});
socket.on('start',function(data){ //begin
    render(JSON.parse(data));
    console.log(data);
});
socket.on('invalid_room',function(){ //begin
    window.location.href ='/rooms';
});

socket.on('update',function(data){ //not my turn, update the table, scores, and the hand of the player who just played
    updateTable(data.table);
    updateLastPlayer(data.whoPlayed);

});
socket.on('updatePlayer', function (data) { //my turn, update everything
    if(data !== -1)  // if i played in MY turn
        render(JSON.parse(data));
});
socket.on('player_disconnected', function (data) { //a player left the game
    var player_id = data.player_id;
});

$(document).on("click",".card",function(){
    var id_array= $(this).attr("id").split("_");
    socket.emit('step', {player:id_array[0],card:id_array[1]});
});

$(document).on("click","#next",function(){
    socket.emit('step', {player:-1,card:-1});
});
