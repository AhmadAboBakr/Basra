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
        //return "1";
        return JSON.stringify({color:this.color,number:this.number});
    }
    return this;
}
/**
 * Player class, Human and Npc extend from it
 * @type {Object}this
 */
function Player() {
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

    this.play = function () {
        var ret = false;
        this.hand.forEach(function (card) {
            if (game.table.compareCards(card) != -1) {
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
function Game() {
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
        var buffer = player.name + " cards are:";
        player.hand.forEach(function (card) {
            buffer += " " + card.getCard();
        });
        var card = player.play();
        buffer += " .... he played :" + card.getCard();
        console.log(buffer);
        if (this.table.cards.length === 0) {
            this.table.cards.push(card);
        }
        else if (card.number==11 || (card.number==7 && card.color=='k')){
            player.score+=1;
            while(this.table.cards.length!=0){
                player.score+=1;
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
            else player.score +=1;
        }
    }

    /**
     * deal cards
     */
    this.deal = function () {
        console.log("dealing...");
        if (this.deck.length == 52) {
            console.log("first deal...\n");

            this.table.cards.push(game.deck.pop());
            this.table.cards.push(game.deck.pop());
            this.table.cards.push(game.deck.pop());
            this.table.cards.push(game.deck.pop());
        }
        this.players.forEach(function (player) {
            player.hand.push(game.deck.pop());
            player.hand.push(game.deck.pop());
            player.hand.push(game.deck.pop());
            player.hand.push(game.deck.pop());

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

                //this is should be changed
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
        console.log("Deck has:" + this.deck.length);
        var names = ["7amada", "7amooda", "abo7meed", "a7mad"];
        for (var i = 0; i < 4; ++i) {
            var pl = new Npc(names[i]);
            console.log(pl);
            this.players.push(pl);
        }
        this.deal();
    };

    this.gameLoop = function () {
        var buffer;
        while (true) {
            for (var i = 0; i < 4; i++) {
                buffer = "Table:";
                this.table.cards.forEach(function (card) {
                    buffer += " " + card.getCard()
                })
                console.log(buffer);
                this.players.forEach(function (player) {
                    if (player.hand.length === 0) {
                        return false;
                    }
                    this.collect(player);
                    console.log(player.name + "'s score:" + player.score + "\n");
                }, this);
            }
            if (this.deck.length === 0)break;
            this.deal();
        }
        console.log("\n------------------------------------------------\n");
        this.players.forEach(function (player) {
            console.log(player.name + "Score :" + player.score);
        });
        console.log("There are " + this.table.cards.length + " Left on the floor");
    };

}

var game = new Game;
game.init();
game.gameLoop();