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
var gameCommon = require('../public/js/game.js').game;

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
     * Players, each player is {score,hand:[{color,number}*],name}
     */
    this.players = [];

    /**
     * which player should play next
     */
    this.turn = 0;

    /**
     * total turns played
     */
    this.totalTurns = 0;

    /**
     * should be called after every played card, to calculate the score and update the floor
     */
    this.collect = function (player,cardId) {
        var card=(cardId==-1)?player.play(this.table):player.hand[cardId];
        if(!card)card = player.play(this.table); //if the player plays a card he doesn't have, play a random one

        player.hand = player.hand.filter(function (element) { //remove tha card from the players hand
            ///this  returns all but card
            return (element !== card);
        });
        var results = gameCommon.collect(card,this.table);
        player.score += +results.score;
        var collectedCards = results.collectedCards;
        return {
            cardPlayed: card,
            cardsCollected: collectedCards
        };
    };

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
        var mapper = {0:'clubs', 1:'diams', 2:'hearts', 3:'spades'};
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
        var names = ["machine", "machine", "machine", "machine"];
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
     * @param timeout
     * @return {*}
     */
    this.step = function (playerId,cardId,timeout) {
        timeout = timeout || false;
        var ret = {};
        var collect; //the returned object from this.collect
        var player;
        if(playerId==-1 && cardId==-1){  //npc or timed out player
            player = this.players[this.turn];
            if ( this.players[this.turn].hand.length === 0 ) { //if npc has no cards
                if( this.deck.length!=0 )this.deal();
                else return this.init();  //if deck has no cards
            }
            collect = this.collect( this.players[this.turn] , cardId );
            this.turn++;
            this.turn %= 4;
            if(timeout)
                player.timeouts++;
            else
                player.timeouts = 0;
        }
        else if( playerId != this.turn ){  //i.e NOT YOUR TURN
            return -1;
        }
        else{
            player = this.players[ playerId ];
            if ( player.hand.length === 0 ) {
                if( this.deck.length!=0 )this.deal();
                else return this.init();
            }
            else {
                collect = this.collect( player, cardId );
                this.turn++;
                if(this.turn>3)
                    this.turn=0;
            }
            ret.timeouts = player.timeouts;
        }
        if(this.players[3].hand.length==0){
            this.deal();
            ret.new_deal = "true";
        }
        ret.players = this.players;
        ret.table = this.table;
        ret.totalTurns = ++this.totalTurns;
        ret.cardPlayed = collect.cardPlayed;
        ret.cardsCollected = collect.cardsCollected;
        return JSON.stringify(ret);
    };

    /**
     * Gets the current game state
     */
    this.getState = function(){
        return JSON.stringify({players:this.players,table:this.table});
    };

    /**
     * Gets the current game state for one player, hides other players
     * @param id
     * @return {*}
     */
    this.getStateFor = function(id){
        id = (id === -1)?this.turn:id;
        var players = {};
        for(var i =0 ; i < 4 ; ++i){
            if(i == id){
                players['me'] = this.players[i];
            }
            else{
                players[i] = ({hand:this.players[i].hand.length,score:this.players[i].score,name:this.players[i].name});
            }
        }
        return JSON.stringify({players:players,table:this.table});
    };

    /**
     * Gets the current game state for the current player, hides other players
     * @param id
     * @return {*}
     */
    this.getStateForCurrentPlayer = function(){
        var players = {};
        for(var i =0 ; i < 4 ; ++i){
            if(i == this.turn){
                players['me'] = this.players[i];
            }
            else{
                players[i] = ({hand:this.players[i].hand.length,score:this.players[i].score,name:this.players[i].name});
            }
        }
        return JSON.stringify({players:players,table:this.table,current:this.turn});
    };

    /**
     * Gets the current game state for a new watcher,
     * just showing number of cards, scores, names for each player, and table cards
     * @return {*}
     */
    this.getStateForWatcher = function(){
        var players = {};
        for(var i =0 ; i < 4 ; ++i){
            players[i] = ({hand:this.players[i].hand.length,score:this.players[i].score,name:this.players[i].name});
        }
        return JSON.stringify({players:players,table:this.table});
    };

    /**
     * Get the scores of all players in this game
     * @return {} containing names:[],scores:[]
     */
    this.getScores = function(){
        var ret = {names:[],scores:[]};
        for(var i =0; i <4; i++){
            ret.names.push(this.players[i].name);
            ret.scores.push(this.players[i].score);
        }
        return ret;
    }
};

exports.game = Game;
