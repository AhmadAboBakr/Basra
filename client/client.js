/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/22/13
 * Time: 11:39 PM
 */
var game = {};
var render = function(data){
    if(!data.hasOwnProperty("players"))return;
    for(var i=0;i<4;++i){
        $("#player"+i).html("");
        for(var j=0;j<data.players[i].hand.length;j++){
            $("#player"+i).html(function(index,oldHtml){
                var id=""+i+"_"+j;
                return oldHtml + '<div class="card" id="'+id+'"><div class="'+data.players[i].hand[j].color+'">&'+data.players[i].hand[j].color+';</div><br>'+data.players[i].hand[j].number+'</div>';
            });
        }
    }
    $("#table").html("");
    for(var k =0; k < data.table.cards.length ; ++k){
        $("#table").html(function(index,oldHtml){
            return oldHtml + '<div class="card"><div class="'+data.table.cards[k].color+'">&'+data.table.cards[k].color+';</div><br>'+data.table.cards[k].number+'</div>';
        });
    }
};
$.get('/start',render,'json');
$("#next").click(function(){
    $.get('/step',{player:-1,card:-1},render,'json')
});

$(document).on("click",".card",function(){
    var id_array= $(this).attr("id").split("_");
    var card= id_array[1];
    var player=id_array[0];
    $.get('/step',{player:player,card:card},render,'json')
});
