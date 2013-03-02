/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/23/13
 * Time: 1:44 PM
 */
/**
 * Human player
 */
exports.Human = function () {
    Player.call(this);
}
exports.Human.prototype = Object.create(Player.prototype);