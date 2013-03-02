/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/15/13
 * Time: 5:51 PM
 */
var Card = require('./classes/card.js').Card;
var Player = require('./classes/player.js').Player;
var Human = require('./classes/player.js').Human;
var Npc = require('./classes/player.js').Npc;
var Table = require('./classes/table.js').Table;

/**
 * The game object. Handles everything
 * @type {Object}
 */
Game = function () {

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
     * which player should play next
     */
    this.turn = 0;

    /**
     * should be called after every played card, to calculate the score and update the floor
     */
    this.collect = function (player,cardId) {
        var card=(cardId==-1)?player.play(this.table):player.hand[cardId];
        player.hand = player.hand.filter(function (element) {
            ///this  returns all but card
            return (element !== card);
        });
        if (this.table.cards.length === 0) {
            this.table.cards.push(card);
        }
        else if (card.number == 11 || (card.number == 7 && card.color == 'diams')) {
            player.score += 1;
            while (this.table.cards.length != 0) {
                player.score += 1;
                this.table.cards.pop();
            }
        }
        else {
            var index;
            var collected = false;
            while (( index = this.table.compareCards(card)) !== -1) {
                this.table.cards.splice(index, 1);
                player.score += (this.table.cards.length !== 0) ? 1 : 11;
                collected = true;
            }
            if (!collected)
                this.table.cards.push(card);
            else player.score += 1;
        }
    }

    /**
     * deal cards
     */
    this.deal = function () {
        var that = this;
        if (this.deck.length == 52) {
            for(var i=0;i<4;++i){
                this.table.cards.push(that.deck.pop());
            }
        }
        this.players.forEach(function (player) {
            for(var j=0;j<4;++j){
                player.hand.push(that.deck.pop());
            }
            player.hand.sort(function (a,b){
                if (a.number < b.number)
                    return -1;
                if (a.number > b.number)
                    return 1;
                return 0;
            });
        }, this);
    };


    /**
     * Initialize Deck
     */
    this.initDeck = function () {
        mapper = {0:'clubs', 1:'diams', 2:'hearts', 3:'spades'};
        for (var i = 0; i < 4; ++i) {
            for (var j = 1; j < 14; ++j) {
                var obj = new Card(mapper[i], j);
                this.deck.push(obj);
            }
        }
        this.deck.sort(function () {
            return Math.round(Math.random());
        });
    };

    this.init = function () {
        this.initDeck();
        var names = ["7amada", "7amooda", "abo7meed", "a7mad"];
        for (var i = 0; i < 4; ++i) {
            var pl = new Npc(names[i]);
            this.players.push(pl);
        }
        this.deal();
        return JSON.stringify({players:this.players,table:this.table});
    };
    /**
     *
     * returns -1 if it's not the turn of the player with playerId
     * Object containing the players an the table otherwise
     * @param playerId
     * @param cardId
     * @return {*}
     */
    this.step = function (playerId,cardId) {
        if(playerId==-1 && cardId==-1){  //npc
            if ( this.players[this.turn].hand.length === 0 ) { //if npc has no cards
                if( this.deck.length!=0 )this.deal();
                else return this.init();  //if deck has no cards
            }
            this.collect( this.players[this.turn] , cardId );
            this.turn++;
            this.turn %= 4;
        }
        else if( playerId != this.turn ){  //i.e NOT YOUR TURN
            return JSON.stringify({});
        }
        else{
            var player=this.players[ playerId ];
            if ( player.hand.length === 0 ) {
                if( this.deck.length!=0 )this.deal();
                else return this.init();
            }
            else {
                this.collect( player, cardId );
                this.turn++;
                if(this.turn>3)
                    this.turn=0;
            }
        }
        return JSON.stringify({players:this.players,table:this.table});
    }
}

exports.game = Game;
