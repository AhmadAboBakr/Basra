/**
 * Created with JetBrains PhpStorm.
 * User: Nookz
 * Date: 2/23/13
 * Time: 1:42 PM
 */
/**
 * Card
 *
 */
exports.Card = function (color, number) {
    /**
     * diams,clubs,spades,hearts
     * @type {*}
     */
    this.color = color;

    /**
     * 1->13
     * @type {*}
     */
    this.number = number;

    /**
     *
     * @param type bool 0 for html, 1 for console
     * @return {*}
     */
    this.getCard = function (type) {
        //return "1";
        return JSON.stringify({color:this.color, number:this.number});
    }
    return this;
}
