/**
* @author: Ahmed Maged
* Date: 7/7/13 - 9:39 PM
*
* This file contains utility helpers, helpers that are not specific to anything
*
*/
var glob = require('../init.js');

exports.make_id = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

exports.isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
};