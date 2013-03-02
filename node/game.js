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


Card = function (color, number) {
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
    this.getCard = function (type) {
        //return "1";
        return JSON.stringify({color:this.color, number:this.number});
    }
    return this;
}
/**
 * Player class, Human and Npc extend from it
 * @type {Object}this
 */
Player = function () {
    this.score = 0;
    this.hand = [];
    this.name = "";
    this.play = function () {
        return false;
    }
}

/**
 * Human player
 */
function Human() {
    Player.call(this);
}
Human.prototype = Object.create(Player.prototype);
/**
 * Machine player
 */
function Npc(name) {
    Player.call(this);
    this.name = name;
    this.play = function (table) {
        var ret = false;
        this.hand.forEach(function (card) {
            if (table.compareCards(card) != -1) {
                ret = card;
            }
        });
        if (!ret)return  this.hand[0];
        return ret;
    };
    this.push = function (card) {
        this.hand.push(card);
    }
}
Npc.prototype = Object.create(Player.prototype);

function Table() {
    this.cards = [];
    this.compareCards = function (obj) {
        for (var i = 0; i < this.cards.length; ++i) {
            if (this.cards[i].number == obj.number) {
                return i;
            }
        }
        return -1;
    };
}

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
            ///this  return all but card
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
        console.log("dealing...");
        var that = this;
        if (this.deck.length == 52) {
            this.table.cards.push(that.deck.pop());
            this.table.cards.push(that.deck.pop());
            this.table.cards.push(that.deck.pop());
            this.table.cards.push(that.deck.pop());
        }
        this.players.forEach(function (player) {
            player.hand.push(that.deck.pop());
            player.hand.push(that.deck.pop());
            player.hand.push(that.deck.pop());
            player.hand.push(that.deck.pop());
            player.hand.sort(function (a,b){

                    if (a.number < b.number)
                        return -1;
                    if (a.number > b.number)
                        return 1;
                    return 0;

            });
        }, this);
        console.log("deck has:" + this.deck.length + "\n");
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
     * @param card
     * @return {*}
     */
    this.step = function (playerId,cardId) {
        if(playerId==-1 && cardId==-1){
            this.collect(this.players[this.turn++],cardId);
            this.turn%=4;
        }
        else if(playerId!=this.turn){
            return false;
        }
        else{
            var player=this.players[playerId];
            if (player.hand.length === 0) {
                if(this.deck.length!=0)this.deal();
                else return this.init();
            }
            else {
                this.collect(player,cardId);
                this.turn++;
                if(this.turn>3)
                    this.turn=0;
            }
        }
//        if(npc)player.play(this.table);
        return JSON.stringify({players:this.players,table:this.table});
    }
    // console.log("There are " + this.table.cards.length + " Left on the floor");
}

exports.game = Game;
