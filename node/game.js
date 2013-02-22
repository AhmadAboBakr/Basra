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
        if (!ret)return this.hand.pop();
        this.hand = this.hand.filter(function (element) {///this  return all but ret
            return (element !== ret);
        });
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
    this.collect = function (player) {
        var buffer = player.name + " cards are:";
        player.hand.forEach(function (card) {
            buffer += " " + card.getCard();
        });
        var card = player.play(this.table);
        buffer += " .... he played :" + card.getCard();
        console.log(buffer);
        if (this.table.cards.length === 0) {
            this.table.cards.push(card);
        }
        else if (card.number == 11 || (card.number == 7 && card.color == 'k')) {
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

        }, this);
        console.log("deck has:" + this.deck.length + "\n");
    };


    /**
     * Initialize Deck
     */
    this.initDeck = function () {
        mapper = {0:'t', 1:'k', 2:'h', 3:'s'};
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

    this.step = function () {
        var buffer;
        buffer = "Table:";
        this.table.cards.forEach(function (card) {
            buffer += " " + card.getCard()
        });
        console.log(buffer);
        var player=this.players[this.turn++];
        if (player.hand.length === 0) {
            if(this.deck.length!=0)this.deal();
            else return this.init();
        }
        else {
            this.collect(player);
            console.log(player.name + "'s score:" + player.score + "\n");
            if(this.turn==4)
                this.turn=0;
        }
        return JSON.stringify({players:this.players,table:this.table});
    }
    console.log("\n------------------------------------------------\n");
    this.players.forEach(function (player) {
        console.log(player.name + "Score :" + player.score);
    });
   // console.log("There are " + this.table.cards.length + " Left on the floor");
}
exports.game = Game;
