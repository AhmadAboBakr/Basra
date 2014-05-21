/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/23/13
 * Time: 1:46 PM
 */


exports.Table = function() {
    this.cards = [];
    this.compareCards = function (obj) {
	collectedCards=[];
        for(var i=0;i<this.cards.length;i++){
		console.log(this.cards);
		console.log(i);
		if(this.cards[i].number>obj.number)break;
		if(this.cards[i].number==obj.number){
			collectedCards.push(i);
			
		}
		for(var j=i+1;j<this.cards.length;++j){
			if(this.cards[i].number+this.cards[j].number==obj.number){
				collectedCards.push(i);
				collectedCards.push(j)
			}
		}
	}
        return collectedCards;
    };
};
