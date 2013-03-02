/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/23/13
 * Time: 1:43 PM
 */
/**
 * Player class, Human and Npc extend from it
 * @type {Object}this
 */
exports.Player = function () {
    this.score = 0;
    this.hand = [];
    this.name = "";
    this.play = function () {
        return false;
    }
}