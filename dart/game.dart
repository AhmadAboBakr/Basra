library Kotshena;

import './card.dart';
import './player.dart';
import './table.dart';
import './helper.dart';


/**
 * The game object. Handles everything
 * @type {Object}
 */
class Game{
  var deck = [];/// The cards Deck
  var table;/// The cards on the floor
  var players = [];/// The players
  
  /**
   * should be called after every played card, to calculate the score and update the floor
   */
  collect (Player player) {
    var card = player.play();
    print("jo");
    print("${player.name} played..${card.number}");
    if(this.table.cards.length==0)
    {
      this.table.cards.add(card);
    }
    else {
      var index;
      var collected = false;
      while(( index = this.table.compareCards(card))!=-1){
        this.table.cards.removeAt(index);
        player.score +=(this.table.cards.length!=0)?2:10;
        collected = true;
      }
      if(!collected)
        this.table.cards.add(card);
    }
  }

  /**
   * deal cards
   */
  deal () {
    print("dealing...\n");
    var buffer=new StringBuffer();
    if (this.deck.length == 52) {
      print("first deal...\n");
      this.table.cards.add(this.deck.removeLast());
      this.table.cards.add(this.deck.removeLast());
      this.table.cards.add(this.deck.removeLast());
      this.table.cards.add(this.deck.removeLast());
    }
    this.players.forEach((player ) {
      player.hand.add(this.deck.removeLast());
      player.hand.add(this.deck.removeLast());
      player.hand.add(this.deck.removeLast());
      player.hand.add(this.deck.removeLast());
      buffer.add("${player.name} has ${player.hand.length} cards:  ");
      player.hand.forEach((card){
        buffer.add("{${card.number}:${card.color}} , ");
      });
      print(buffer.toString());
      buffer.clear();
    });
    this.table.cards.forEach((card)=>buffer.add("{${card.number}:${card.color}} , "));
    print("The cards on the table ${buffer.toString()}");
    print("deck has:${this.deck.length}\n");
    buffer.clear();
    
  }

  /**
   * Initialize Deck
   */
  initDeck () {
    for (var i = 1; i < 5; ++i) {
      for (var j = 1; j < 14; ++j) {
        var tempCard = new Card(i,j);
        this.deck.add(tempCard);
      }
    };
    this.deck=Helper.shuffle(this.deck);
  }

  gameLoop () {
    while(true){
      if(this.deck.isEmpty)break;
      this.deal();
      for(var i=0;i<4;++i){
        print("+++++++++++++");
        this.players.forEach((player) {
          if (player.hand.length == 0){
            return false;
          }
          this.collect(player);
          print("${player.name}'s score:${player.score} \n");
        });
    }
    
    print("\n------------------------------------------------\n");
    //if (this.deck.length == 0)break;
    this.players.forEach((player){
      print("${player.name} scored: ${player.score}");
    });
    print("${table.cards.length} on the floor");
  }
    }

  /**
   *   The constructor: initilizes the Deck and the players
   */ 
  Game() {
    table = new Table();
    this.initDeck();
    print("Deck has:${this.deck.length}");
    var names = ["7amada","7amooda","abo7meed","a7mad"];
    for(var i =0;i<4;++i){
      var pl = new Npc(names[i],1000);
      this.players.add(pl);
    }
  }  
}

