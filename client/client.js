/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/15/13
 * Time: 5:51 PM
 */
/**
 * Card
 *
 */
Card= function (color,number){
    /**
     * k,t,s,h
     * @type {*}
     */
    this.color = color;
    this.number = number;

    /**
     *
     * @param type bool 0 for html, 1 for console
     * @return {*}
     */
    this.getCard =function (type){
        if(type===1){
            return "{"+this.color+","+this.number+"}";
        }
        return '<div class="card"><div class="'+this.color+'"></div><br>'+this.number+'</div>';
    }
    return this;
}
/**
 * Player class, Human and Npc extend from it
 * @type {Object}this
 */
function Player() {
    this.score=0;
    this.hand=[];
    this.name = "";
    this.play = function(){
        return false;
    }
    this.push = function(){
        return false;
    }
    this.updateHtml = function(){
        return false;
    }
}

/**
 * Human player
 */
function Human() {}
Human.prototype = Object.create(Player.prototype);
/**
 * Machine player
 */
function Npc(name) {
    Player.call(this);
    this.name=name;

    this.play =function () {
        var ret = false;
        this.hand.forEach (function(card){
            if(game.table.compareCards(card)!=-1){
                ret = card;
            }
        });
        if(!ret)return this.hand.pop();
        this.hand = this.hand.filter( function (element){///this  return all but ret
            return (element!==ret);
        });
        return ret ;
    };

    this.push = function(card){
        this.hand.push(card);
    }
    this.updateHtml = function(){
        var html = this.score + " ";
        for(var i =0; i<this.hand.length ; i++){
            html += this.hand[i].getCard(0);
        }
        $("#"+this.name).html(html);
        console.log("#"+this.name);
    }
}
Npc.prototype = Object.create(Player.prototype);

function Table() {
    this.cards=[];
    this.compareCards = function(obj) {
        for (var i = 0; i < this.cards.length; ++i) {
            if (this.cards[i].number== obj.number) { return i; }
        }
        return -1;
    };
    this.push = function(card){
        this.cards.push(card);
    }
    this.updateHtml = function(){
        var html = "";
        for(var i =0; i<this.cards.length ; i++){
            html += this.cards[i].getCard(0);
        }
        $("#table").html(html);
    }
}

/**
 * The game object. Handles everything
 * @type {Object}
 */
function Game () {
    /**
     * The cards Deck
     */
    this.deck = [];
    /**
     * cards on floor
     */
    this.table = new Table;
    /**
     * Players
     */
    this.players = [];

    /**
     * should be called after every played card, to calculate the score and update the floor
     */
    this.collect = function (player) {
        var card = player.play();
        if(this.table.cards.length===0)
        {
//            $("#log").html("throwing card!");
            this.table.push(card);
        }
        else {
            var index;
            var collected = false;
            while(( index = this.table.compareCards(card))!==-1){
                this.table.cards.splice(index,1);
                player.score +=(this.table.cards.length!==0)?2:11;
//                $("#log").html("collected card(s)!");
                collected = true;
            }
            for(var i = 0; i< this.table.length ; i++){
                if(index = this.table.compareCards(card) !== -1){
                    player.score +=(this.table.cards.length!==0)?2:11;
                    this.table.cards.splice(index,1);
                    collected = true;
                }
                ///if( 2 cards add up to a number the player has)
                ////do the same

                //if( player has a jack) play it

            }
            if(!collected)
            {
//                $("#log").html("throwing card!");
                this.table.push(card);
            }

        }
    }

    /**
     * deal cards
     */
    this.deal = function () {
        console.log("dealing...");
        if (this.deck.length == 52) {
            console.log("first deal...\n");
            this.table.push(game.deck.pop());
            this.table.push(game.deck.pop());
            this.table.push(game.deck.pop());
            this.table.push(game.deck.pop());
        }
        this.players.forEach(function (player ) {
            player.push(game.deck.pop());
            player.push(game.deck.pop());
            player.push(game.deck.pop());
            player.push(game.deck.pop());

        },this);
        console.log("deck has:"+this.deck.length+"\n");
        for(var j=0;j<this.players.length ; j++){
            this.players[j].updateHtml();
        }
    };


    /**
     * Initialize Deck
     */
    this.initDeck = function () {
        mapper= {0:'trefl',1:'karoh',2:'heart',3:'spade'};
        for (var i = 0; i < 4; ++i) {
            for (var j = 1; j < 14; ++j) {
                var obj = new Card(mapper[i],j);
                this.deck.push(obj);
            }
        }
        //check for jacks in first 4 cards
        var jacks = 1;
        while(jacks){
            this.deck.sort(function () {
                return Math.round(Math.random());
            });
            jacks = false;
            for(var k=51 ; k > 47 ; k--){
                if(this.deck[k].number == 11)
                    jacks = true;
            }
            console.log(jacks)
        }
    };

    this.init = function () {
        this.initDeck();
        console.log("Deck has:"+this.deck.length);
        var names = ["player_7amada","player_7amooda","player_abo7meed","player_a7mad"];
        for(var i=0;i<names.length;i++){
            $("#player"+i).attr('id',names[i]);
        }
        for(var k =0;k<4;++k){
            var pl = new Npc(names[k]);
            console.log(pl);
            this.players.push(pl);
        }
        this.deal();
        this.table.updateHtml();

    };

    this.nextPlayer = 0;

    this.gameStep = function () {
        var playersHaveCards = false;
        this.players.forEach(function(player) {
            if (player.hand.length != 0){
                playersHaveCards  = true;
            }
        },this);
        if (this.deck.length === 0 && !playersHaveCards) {
            console.log("no more cards");
            return 1;
        }
        if(playersHaveCards){
            console.log("playing...");
            this.nextPlayer = (this.nextPlayer + 1)%4;
            $("#log").html("next player:"+this.nextPlayer);
            var player = this.players[this.nextPlayer];
            if (player.hand.length === 0){
                return false;
            }
            this.collect(player);
            player.updateHtml();
            this.table.updateHtml();
        }
        else{
            console.log("dealing...");
            this.deal();
        }

    };

}

var game = new Game;
game.init();
//game.gameLoop();
$(document).on("click",'#next',function(){game.gameStep();});