/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/23/13
 * Time: 1:45 PM
 */
/**
 * Machine player
 */
exports.Npc = function (name) {
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