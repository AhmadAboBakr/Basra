/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/22/13
 * Time: 11:39 PM
 */
var game = {};

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
    for(var i=0;i<4;++i){
        $("#player"+i).html("");
        for(var j=0;j<data.players[i].hand.length;j++){
            $("#player"+i).html(function(index,oldHtml){
                var id=""+i+"_"+j;
                return oldHtml + '<div class="card '+data.players[i].hand[j].color+data.players[i].hand[j].number+'" id="'+id+'"></div>';
            });
        }
    }
    $("#table").html("");
    for(var k =0; k < data.table.cards.length ; ++k){
        $("#table").html(function(index,oldHtml){
            return oldHtml + '<div class="card '+data.table.cards[k].color+data.table.cards[k].number+'"></div>';
        });
    }
    updateTable();
}
$.get('/start',render,'json');
$("#next").click(function(){
    $.get('/step',{player:-1,card:-1},render,'json')
});

$(document).on("click",".card",function(){
    var id_array= $(this).attr("id").split("_");
    $.get('/step',{player:id_array[0],card:id_array[1]},render,'json')
});
