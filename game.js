/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/15/13
 * Time: 5:51 PM
 */
/**
 * Card
 * @type {Object}
 */
function Card(){
    this.color = null;
    this.number = null;
}
/**
 * Player class, Human and Npc extend from it
 * @type {Object}
 */
function Player() {
    this.score=0;
    this.hand=[];
    this.name = "";
}
Player.prototype.play = function(){
    return false;
}
/**
 * Human player
 */
function Human() {};
Human.prototype = Object.create(Player.prototype);
/**
 * Machine player
 */
function Npc() {
    Player.call(this);
}
Npc.prototype = Object.create(Player.prototype);
Npc.prototype.play =function () {
    var ret = false;
//    this.hand.forEach (function(card){
//        if(game.table.compareCards(card)){
//            ret = card;
//        }
//    });
//    return ret | this.hand.pop() | false;
    return this.hand.pop();
};
function Table() {
    this.cards=[];
}
Table.prototype.compareCards = function(obj) {
    for (var i = 0; i < this.cards.length; ++i) {
        if (this.cards[i].number== obj.number) { return i; }
    }
    return -1;
};
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

}
/**
 * should be called after every played card, to calculate the score and update the floor
 */
Game.prototype.collect = function (player) {
    var card = player.play();
    console.log(player.name+" played.."+card.number+" \n");
    if(this.table.cards.length===0)
    {
//        console.log("no cards on the floor, the player is just going to throw the card...\n");
        this.table.cards.push(card);
    }
    else {
//        console.log("there are "+this.table.cards.length+" cards on the floor, let's see what happens...\n");
        console.log(this.table.cards);
        console.log(card);
        var index;
        var collected = false;
        while(( index = this.table.compareCards(card))!==-1){
            this.table.cards.splice(index,1);
            player.score +=(this.table.cards.length===0)?2:10;
            collected = true;
        }
        if(!collected)
            this.table.cards.push(card);
    }
}
/**
 * deal cards
 */
Game.prototype.deal = function () {
    var $this = this;
    console.log("dealing...\n");
    if (this.deck.length == 52) {
        console.log("first deal...\n");
        this.table.cards.push(this.deck.pop());
        this.table.cards.push(this.deck.pop());
        this.table.cards.push(this.deck.pop());
        this.table.cards.push(this.deck.pop());
    }
    this.players.forEach(function (player ) {
        player.hand.push($this.deck.pop());
        player.hand.push($this.deck.pop());
        player.hand.push($this.deck.pop());
        player.hand.push($this.deck.pop());
    });
    console.log("deck has:"+this.deck.length+"\n");
};
/**
 * Initialize Deck
 */
Game.prototype.initDeck = function () {
    for (var i = 1; i < 5; ++i) {
        for (var j = 1; j < 14; ++j) {
            var tempCard = Object.create(Card);
            tempCard.number = j;
            tempCard.color = i;
            this.deck.push(tempCard);
        }
    }
    this.deck.sort(function () {
        return Math.round(Math.random());
    });
};

Game.prototype.initz = function () {
    this.initDeck();
    console.log("Deck has:"+this.deck.length+"\n");
    var names = ["7amada","7amooda","abo7meed","a7mad"];
    for(var i =0;i<4;++i){
        var pl = new Npc();
        pl.name = names[i];
        this.players.push(pl);
    }
    this.deal();
    console.log("Deck has:"+this.deck.length+"\n");

};
Game.prototype.gameLoop = function () {
    $this =  this;
    for (var j =0;j<1;j++) {
        for(var i =0;i<4;i++){
            console.log("\n+++++++++++++\n");
            console.log("there are "+game.table.cards.length+" cards on the floor.. \n");
            $this.players.forEach(function(player){
                console.log("player "+player.name+" has: " + player.hand.length);
            });
            console.log("\n");
            $this.players.forEach(function(player) {
                if (player.hand.length === 0){
                    return false;
                }
                $this.collect(player);
                console.log(player.name+"'s score:"+player.score+"\n");
            });
        }
        console.log("\n------------------------------------------------\n");
        if (this.deck.length === 0)break;
        $this.deal();
    }
};
var game = new Game;
game.initz();
game.gameLoop();