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
Human = Player.extend({});
/**
 * Machine player
 */
Npc = Player.extend({});
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
    deal:function(){}
}

for(var i =1;i<53;i++){
    Game.deck.push();
}






