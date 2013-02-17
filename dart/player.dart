/**
 * Player class, Human and Npc extend from it
 */
library Kotshena;
import './helper.dart';
class Player{
    var score=0;
    var hand=[];
    var name = "";
    play (){}
    Player (this.name);//Constructor
}

/**
 * Machine Player
 */
class Npc extends Player{
  var difficulty;
  Npc(name,this.difficulty):super(name);
  play (){
    switch(difficulty){
      case 0:
        return hand.removeAt(Helper.rand(this.hand.length));
      case 1:
        return 0;
      default:
        return hand.removeLast();
    }    
  }
}


