/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/15/13
 * Time: 5:51 PM
 */
/**
 * Card
 * @type {Object}
 */
Card = {
    color:null,
    number:null
};
/**
 * Player class, Human and Npc extend from it
 * @type {Object}
 */
Player = {
    score:null
}
/**
 * Human player
 */
Human = {};
/**
 * Machine player
 */
Npc = {};
/**
 * The game object. Handles everything
 * @type {Object}
 */
Game = {
    /**
     * TODO: populate with cards
     */
    deck:[],
    /**
     * should be called after every played card, to calculate the score and update the floor
     */
    collect:function(){},
    /**
     * deal cards
     */
    deal:function(){},
  /**
   * Initialize Deck 
   */
    initDeck:function(){
		for(var i = 1 ; i<5 ; ++i){
			for (var j =1; j < 14 ; ++j){
				var tempCard = Object.create(Card);
				tempCard.number=j;
				tempCard.color=i;
				Game.deck.push(tempCard);		
			}
		}
	}
}
