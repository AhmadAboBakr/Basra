/**
 * @author Nookz
 * Date: 2/22/13
 * Time: 11:39 PM
 */
var game = {};
var socket = io.connect('http://localhost:3000');
var watcher = false;

function generate_player_info_html(name,score){
    return "<div class = 'pinfo'>"+
                "<img src='../images/ch"+(parseInt(Math.random()*10)%3 +1)+".jpg' style='width:40px;' /><br>"+
                "<span class='name'>"+name +" : </span>"+
                "<span class='score'>"+score+"</span>"+
            "</div>";
}

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
function renderMe(me,myNumber){
    var html = "";
    if(myNumber!==3) //the left player should have cards_container before pinfo
        html = generate_player_info_html(me.name,me.score);
    html += "<div class='cards_container'>";
    for(j=0;j<me.hand.length;j++){
        var id=myNumber+"_"+j;
        html += '<div class="card '+me.hand[j].color+me.hand[j].number+'" id="'+id+'"></div>';
    }
    html += "</div>";
    if(myNumber===3) //the left player should have cards_container before pinfo
        html += generate_player_info_html(me.name,me.score);
    $($(".player")[myNumber]).html(html);
}
function updateMe(me,myNumber){
    updatePlayerName(me);
    updatePlayerScore(me);
    if(me.hand){
        var html = "";
        for(j=0;j<me.hand.length;j++){
            var id=myNumber+"_"+j;
            html += '<div class="card '+me.hand[j].color+me.hand[j].number+'" id="'+id+'"></div>';
        }
        $($(".player")[myNumber]).find(".cards_container").html(html);
    }
}
function renderOthers(players){
    
    players.forEach(function(player,index){
        var html = "";
        if(index!==3) //the left player should have cards_container before pinfo
            html = generate_player_info_html(player.name,player.score);
        
        html += "<div class='cards_container'>";
        
        for(var j=0;j<player.hand;j++){
            html += '<div class="cardInvisible"></div>';
        
        }
        html += "</div>";
        
        if(index===3) //the left player should have cards_container before pinfo
            html += generate_player_info_html(player.name,player.score);
        
        $($(".player")[index]).html(html);
    });
}

function updatePlayerName(player){
    if(player.name && player.index)
        $($(".player")[player.index]).find(".pinfo .name").html(player.name);
}
function updatePlayerScore(player){
    if(undefined !== player.score && player.index)
    {
        $($(".player")[player.index]).find(".pinfo .score").html(player.score);
        $($(".player")[player.index]).find(".cardInvisible").first().remove();
    }
}
function removeCardFromPlayer(player){
    if(player.index)
        $($(".player")[player.index]).find(".cardInvisible").first().remove();
}

function render(data,everything){
    everything = (everything === undefined)? true:everything;
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
    if(everything)
        renderOthers(others);
    if(typeof playerNum !== "undefined") //i'm not a watcher
    {
        watcher = false;
        if(everything){
            renderMe(data.players['me'],playerNum);
        }
        else{
            updateMe(data.players['me'],playerNum);
        }
    }
    else{
        watcher = true;
    }
}

socket.emit('start',{room:$_GET('room')});
socket.on('start',function(data){ //begin
    render(JSON.parse(data));
});
socket.on('invalid_room',function(){ //begin
    window.location.href ='/rooms';
});

socket.on('update',function(data){ //not my turn, update the table, scores, and the hand of the player who just played
    updateTable(data.table);
    updatePlayerName(data.whoPlayed);
    updatePlayerScore(data.whoPlayed);

});
socket.on('updatePlayer', function (data) { //my turn, update everything
    if(data !== -1)  // if i played in MY turn
        render(JSON.parse(data),false);
});
socket.on('player_disconnected', function (data) { //a player left the game
    updatePlayerName(data);
    updatePlayerScore(data);
});

$(document).on("click",".card",function(){
    var id_array= $(this).attr("id").split("_");
    socket.emit('step', {player:id_array[0],card:id_array[1]});
});

$(document).on("click","#next",function(){
    socket.emit('step', {player:-1,card:-1});
});
