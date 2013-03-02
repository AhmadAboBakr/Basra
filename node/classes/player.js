/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/23/13
 * Time: 1:43 PM
 */
/**
 * Player class, Human and Npc extend from it
 * @type {Object}this
 */
exports.Player = function () {
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
exports.Human = function() {
    exports.Player.call(this);
}
exports.Human.prototype = Object.create(exports.Player.prototype);
/**
 * Machine player
 */
exports.Npc = function (name) {
    exports.Player.call(this);
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
exports.Npc.prototype = Object.create(exports.Player.prototype);
