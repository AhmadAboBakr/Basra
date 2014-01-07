/**
 * @author Nookz
 * Date: 2/22/13
 * Time: 11:39 PM
 */
var game = {};
var socket = io.connect('http://localhost:3000');
var watcher = false;
var myNumber = null;
var counterState = 1; //weather or not we should turn off the timer
var lastPlayedCard; //last card played by this player

function getCardName(number){
    if(number==1) return 'Ace';
    if(number < 11) return number;
    if(number==11) return 'Jack';
    if(number==12) return 'Queen';
    if(number==13) return 'King';
}

function updateLog(data){
    var collected = "";
    if(data.cardsCollected.length > 0){
        collected = "<br>and collected: <br><span style='color: green;'>";
        for(var i =0; i <data.cardsCollected.length; ++i){
            collected += getCardName(data.cardsCollected[i].number) + " of " + data.cardsCollected[i].color + "<br>";
        }
        collected += "</span>";
    }
    $("#log").append("<p>" +
        "<span style='color: red;'>" + data.name + "</span>" +
        " played <span style='color: blue;'>" + getCardName(data.cardPlayed.number) + " of " + data.cardPlayed.color + "</span>" +
        collected +
        "</p>");
    var objDiv = document.getElementById("log");
    objDiv.scrollTop = objDiv.scrollHeight;
}
/**
 * animate the card being played, card collected (if any)
 * @param callback a function to call once finished
 */
function animate(callback){
    lastPlayedCard.css('border','1px solid #e020e0').css('opacity','0.99').css('box-shadow','0px 0px 10px 3px #e03030');
    $("#table").find('.card').each(function(i,e){
        if(lastPlayedCard.data('number') === $(e).data('number'))
            $(e).css('border','1px solid #e020e0').css('opacity','0.99').css('box-shadow','0px 0px 10px 3px #e03030');
    });
    setTimeout(callback,600);
}

function generate_player_info_html(name,score,number){
    return "<div class = 'pinfo'>"+
                "<span id='"+number+"_picture'><img src='../images/ch"+(parseInt(Math.random()*10)%3 +1)+".jpg' style='width:40px;' /></span><br>"+
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

function displayCounter(replacedDiv,recursive,count){
    if(!recursive){
        var count = 10;
        replacedDiv.hide();
        var counter = '';
    }
    counter = "<span id='counter' style='font-size: 65px;color: blanchedalmond;'>"+ --count +"</span>";
    $(counter).insertAfter(replacedDiv);
    if(count > 0 && window.counterState ==1)
        setTimeout(function(){
            $("#counter").remove();
            displayCounter(replacedDiv,true,count);
        },1000);
    else{
        $("#counter").remove();
        replacedDiv.show();
    }
}

function updateTable(data){
    var table =$("#table");
    table.html("");
    for(var k =0; k < data.cards.length ; ++k){
        table.html(function(index,oldHtml){
            return oldHtml + '<div class="card '+data.cards[k].color+data.cards[k].number+'" data-number="'+data.cards[k].number+'"></div>';
        });
    }

    //prevent the cards from overflowing
    var numOfCardsOnTable = table.children("div").length;
    if(numOfCardsOnTable < 7){
        table.find(".card").css('margin','5px');
    }
    else{
        table.find(".card").css('margin','-15px');
    }
}

function renderMe(me,myNumber){
    var html = "";
    if(myNumber!==3) //the left player should have cards_container before pinfo
        html = generate_player_info_html(me.name,me.score,myNumber);
    html += "<div class='cards_container'>";
    for(var j=0;j<me.hand.length;j++){
        if(!me.hand[j])continue;
        var id=myNumber+"_"+j;
        html += '<div class="card '+me.hand[j].color+me.hand[j].number+'" data-number="'+me.hand[j].number+'" id="'+id+'"></div>';
    }
    html += "</div>";
    if(myNumber===3) //the left player should have cards_container before pinfo
        html += generate_player_info_html(me.name,me.score,myNumber);
    $($(".player")[myNumber]).html(html);
}
function updateMe(me,myNumber){
    updatePlayerName(me);
    updatePlayerScore(me);
    if(me.hand){
        var html = "";
        for(j=0;j<me.hand.length;j++){
            var id=myNumber+"_"+j;
            html += '<div class="card '+me.hand[j].color+me.hand[j].number+'" data-number="'+me.hand[j].number+'"  id="'+id+'"></div>';
        }
        $($(".player")[myNumber]).find(".cards_container").html(html);
    }
}
function renderOthers(players){
    
    players.forEach(function(player,index){
        var html = "";
        if(index!==3) //the left player should have cards_container before pinfo
            html = generate_player_info_html(player.name,player.score,index);
        
        html += "<div class='cards_container'>";
        
        for(var j=0;j<player.hand;j++){
            html += '<div class="cardInvisible"></div>';
        
        }
        html += "</div>";
        
        if(index===3) //the left player should have cards_container before pinfo
            html += generate_player_info_html(player.name,player.score,index);
        
        $($(".player")[index]).html(html);
    });
}

function updatePlayerName(player){
    if(player.name && player.index)
        $($(".player")[player.index]).find(".pinfo .name").html(player.name);
}
function updatePlayerScore(player){
    if(undefined !== player.score && player.index !== undefined && player.index !== -1)
    {
        $($(".player")[player.index]).find(".pinfo .score").html(player.score);
        $($(".player")[player.index]).find(".cardInvisible").first().remove();
    }
}
function removeCardFromPlayer(player){
    if(player.index)
        $($(".player")[player.index]).find(".cardInvisible").first().remove();
}

function renderScores(players){
    var html = '<div style="font-weight: bold;">Scores</div>';
    for(var i=0 ; i<4 ; ++i){
        html += "<div style='font-style: italic;'>";
        if(players[i])
        {
            html += players[i].name + ": ";
            html += "<span style='color: red;'>" + players[i].score + "</span>";
        }
        else
        {
            html += players.me.name + ": ";
            html += "<span style='color: red;'>" + players.me.score + "</span>";
        }
        html += '</div>';
        $("#scores").html(html);
    }
}

function render(data,everything){
    everything = (everything === undefined)? true:everything;
    if(!data.hasOwnProperty("players"))return; //nothing to render
    renderScores(data.players);
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
    myNumber = playerNum;
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
//    if(data.whoPlayed.index == myNumber) return;
    updateTable(data.table);
    updatePlayerName(data.whoPlayed);
    updatePlayerScore(data.whoPlayed);
    updateLog(data.log);

});
socket.on('updatePlayer', function (data) { //my turn, update everything
    if(data !== -1){  // if i played in MY turn
//        animate(function(){
            render(JSON.parse(data),false);
//        });
    }
});
socket.on('player_disconnected', function (data) { //a player left the game
    updatePlayerName(data);
    updatePlayerScore(data);
});
socket.on('your_turn', function (data) { //a player left the game
    counterState =1;
    displayCounter($("#"+myNumber+"_picture"));
});
function renderScoresHtml(data){
    var html = '<h3>Final Scores: </h3>';
    html += "<table>";
    for(var i =0;i<4;i++){
        html += "<tr>";
        html += "<td>"+data.names[i]+"</td>";
        html += "<td>"+data.scores[i]+"</td>";
        html += "<tr>";
    }
    html += "</table>";
    html += "<button class='reset'>Play Again!</button>";
    $("#log").html(html);
}
socket.on('endOfGame', function (data) {
    var res = ' --Scores-- '+"\n";
    for(var i =0;i<4;i++){
        res += data.names[i] + ": "+data.scores[i]+"\n";
    }
    res += "\n Play Again?";
    if(confirm(res)){
        socket.emit('reset', {room_id:$_GET('room')});
    }
});
$('#dodoe').click(function(){displayCounter($("#"+myNumber+"_picture"));});

$(document).on("click",".card",function(){
    if(!$(this).attr("id")) //probably clicking on a table card
        return;
    counterState =0;
    lastPlayedCard = $(this);
    var id_array= $(this).attr("id").split("_");
    animate(
        function(){
            socket.emit('step', {player:id_array[0],card:id_array[1]});
        }
    );
});

$(document).on("click","#next",function(){
    socket.emit('step', {player:-1,card:-1});
});
$(document).on("click",".reset",function(){
    socket.emit('reset', {room_id:$_GET('room')});
});
