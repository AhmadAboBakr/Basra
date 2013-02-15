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
Card = {
    color:null,
    number:null
};
/**
 * Player class, Human and Npc extend from it
 * @type {Object}
 */
Player = {
    score:null,
    hand:[],
    play:function () {
    }
}
/**
 * Human player
 */
Human = {};
/**
 * Machine player
 */
Npc = {
    score:0,
    hand:[],
    play:function () {
        var ret = false;
        this.hand.forEach (function(card){
            if(Game.table.compareCards(card)){
                ret = card;
            }
        });
        return ret | this.hand.pop() | false;
    }

};
Table ={
    cards:[],
    compareCards : function(obj) {
        for (var i = 0; i < this.length; ++i) {
            if (this.cards[i].number=== obj.number) { return i; }
        }
        return -1;
    }
};
/**
 * The game object. Handles everything
 * @type {Object}
 */
Game = {
    /**
     * The cards Deck
     */
    deck:[],
    /**
     * cards on floor
     */
    table:Table,
    /**
     * Players
     */
    players:[],
    /**
     * should be called after every played card, to calculate the score and update the floor
     */
    collect:function (player) {
       var card = player.play();
       if(Game.table.length===0)
           Game.table.cards.push(card);
       else {
           var index;
           while(( index = Game.table.compareCards(card))!==-1){
              Game.table.cards.splice(index,1);
              player.score +=(Game.table.cards.length===0)?2:10;
           }
       }
    },
    /**
     * deal cards
     */
    deal:function () {
        if (this.deck.length == 52) {
            this.table.cards.push(this.deck.pop());
            this.table.cards.push(this.deck.pop());
            this.table.cards.push(this.deck.pop());
            this.table.cards.push(this.deck.pop());
        }
        Game.players.forEach(function (player ) {
            player.hand.push(Game.deck.pop());
            player.hand.push(Game.deck.pop());
            player.hand.push(Game.deck.pop());
            player.hand.push(Game.deck.pop());
        });
    },
    /**
     * Initialize Deck
     */
    initDeck:function () {
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
    },
    init:function () {
        this.initDeck();
        Game.players.push(Object.create(Npc));
        Game.players.push(Object.create(Npc));
        Game.players.push(Object.create(Npc));
        Game.players.push(Object.create(Npc));
        this.deal();

    },
    gameLoop:function () {
        while (true) {
            console.log("deck:"+this.deck.length+"\n");
            console.log("table:"+this.table.cards.length+"\n");
            this.players.forEach(function(player){
                console.log("Score:"+player.score);
                console.log("Cards:"+player.hand.length);
            });
            console.log("\n");
            var flag =true;
            this.players.every(function(player) {
                if (player.hand.length === 0){
                    flag=false;
                    return false;
                }
                Game.collect(player);
            });
            if (this.deck.length === 0)break;
            this.deal();
        }
    }
}

Game.init();
Game.gameLoop();