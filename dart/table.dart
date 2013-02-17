library Kotshena;

class Table{
  var cards=[];
  compareCards (card) {
    for (var i = 0; i < this.cards.length; ++i)
    {
      if (this.cards[i].number== card.number)
      { 
        return i; 
      }
    }return -1;
  }

}

