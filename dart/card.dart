library Kotshena;

/**
 * Card
 */
class Card{
  var color =null;
  var number = null;
  var map={
           '1':'T',
           '2':'K',
           '3':'H',
           '4':'S'
  };
  Card (color,this.number){//Constructor
    this.color=map[color.toString()];
  }
}