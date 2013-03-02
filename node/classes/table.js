/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/23/13
 * Time: 1:46 PM
 */


exports.Table = function() {
    this.cards = [];
    this.compareCards = function (obj) {
        for (var i = 0; i < this.cards.length; ++i) {
            if (this.cards[i].number == obj.number) {
                return i;
            }
        }
        return -1;
    };
};