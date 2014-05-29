/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/23/13
 * Time: 1:46 PM
 */


exports.Table = function() {
    this.cards = [];
    this.compareCards = function (obj) {
        var collectedCards = [];
        for(var i=0;i<this.cards.length;i++){
            if(this.cards[i].number==obj.number){
                collectedCards.push(i);
                continue;
            }
            //if card is greater than played card or played card is an image, then no combination can be collected
            if(this.cards[i].number > obj.number || obj.number > 10)
            {
                continue;
            }
            for(var j=i+1;j<this.cards.length;++j){
                if(this.cards[i].number+this.cards[j].number==obj.number){
                    collectedCards.indexOf(i) == -1 && collectedCards.push(i);
                    collectedCards.indexOf(j) == -1 && collectedCards.push(j)
                }
            }
        }
        return collectedCards;
    };
};
