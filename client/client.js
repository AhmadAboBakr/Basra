/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/22/13
 * Time: 11:39 PM
 */
var game = {};
var render = function(data){
    for(var i=0;i<4;++i){
        $("#player"+i).html("");
        for(var j=0;j<data.players[i].hand.length;j++){
            $("#player"+i).html(function(index,oldHtml){
                return oldHtml + '<div class="card"><div class="'+data.players[i].hand[j].color+'">&'+data.players[i].hand[j].color+';</div><br>'+data.players[i].hand[j].number+'</div>';
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
$.get('/start',function(data){
    $.get('/start',render,'json');
    $("#next").click(function(){
        $.get('/step',function(data){
        },'json')
    });
},'json');
$("#next").click(function(){
    $.get('/step',render,'json')
});