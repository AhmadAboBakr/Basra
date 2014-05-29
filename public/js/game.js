/**
 * @author Nookz
 * Date: 2/2/14
 * Time: 11:12 AM
 */

exports.game =  {
    /**
     * takes a card and the table and returns an object containing
     *   1.the resulting table after cards have been pushed or popped
     *   2.the cards to be collected by the played card
     *   3.the score the player will get from collecting the cards
     *
     * @param card instance of Card
     * @param table instance of Table
     * @returns {{table: Table, collectedCards: Array, score: number}}
     */
    collect: function(card,table){
        var collectedCards = [];
        var score = 0;
        if (table.cards.length === 0) {
            table.cards.push(card);
        }
        else if (card.number == 11 || (card.number == 7 && card.color == 'diams')) { //Jack or 7 Diamonds
            score += 1;
            while (table.cards.length != 0) {
                score += 1;
                collectedCards.push(table.cards.pop());
            }
        }
        else {
            var index;
            var collected = false;
            var collectedCardIndices = table.compareCards(card);
            while ( (index = collectedCardIndices.pop()) !== undefined) {
                collectedCards = table.cards.splice(index, 1);
                score += (table.cards.length !== 0) ? 1 : 11;
                collected = true;
            }
            if (!collected)
                table.cards.push(card);
            else score += 1; //for the players original card
        }
        return {
            table: table,
            collectedCards: collectedCards,
            score: score
        };
    }
};
