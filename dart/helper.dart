library Kotshena;

import 'dart:math';

class Helper{
  static  rand(int max) {
    var random = new Random();
    return random.nextInt(max);
    
  }
  static List shuffle(List items) {
    var random = new Random();
  
    // Go through all elements.
    for (var i = items.length - 1; i > 0; i--) {
  
      // Pick a pseudorandom number.
      var n = random.nextInt(items.length);
  
      var temp = items[i];
      items[i] = items[n];
      items[n] = temp;
    }
    return items;
  }
}